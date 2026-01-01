import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AUDIO_INTRO = "/static/media/newsIntro.mp3";
const AUDIO_HEAD = "/static/media/newsHead.mp3";
const AUDIO_DETAIL = "/static/media/newsDetails.mp3";

const NewsPlayer = ({ newsData, mode = 'live', onExit }) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(mode === 'replay' ? 'REPLAYING ARCHIVE' : 'Ready to Air');
    const [statusColor, setStatusColor] = useState(mode === 'replay' ? '#8e44ad' : '#27ae60');
    const [prompterText, setPrompterText] = useState("Click 'Go Live' to listen...");
    const [isRunning, setIsRunning] = useState(false);

    // Refs for audio
    const bgmIntroRef = useRef(new Audio(AUDIO_INTRO));
    const bgmHeadRef = useRef(new Audio(AUDIO_HEAD));
    const bgmDetailRef = useRef(new Audio(AUDIO_DETAIL));
    const ttsAudioRef = useRef(new Audio()); // Audio player for TTS
    const isRunningRef = useRef(false);

    // Configure Audio Loops
    useEffect(() => {
        bgmHeadRef.current.loop = true;
        bgmDetailRef.current.loop = true;

        return () => stopImmediately();
    }, []);

    const unlockAudio = async () => {
        const promises = [bgmIntroRef.current, bgmHeadRef.current, bgmDetailRef.current, ttsAudioRef.current].map(a =>
            a.play().then(() => a.pause()).catch(() => { })
        );
        await Promise.all(promises);
    };

    const updatePrompter = (text) => {
        setPrompterText(text);
    };

    // --- NEW: FETCH TTS FROM BACKEND ---
    const playBackendTTS = async (text) => {
        if (!isRunningRef.current) return;

        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    lang: newsData.language || 'ml' // Use backend-provided language or default to Malayalam
                })
            });

            if (!res.ok) throw new Error("TTS Failed");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            return new Promise(resolve => {
                if (!isRunningRef.current) { resolve(); return; }

                ttsAudioRef.current.src = url;
                ttsAudioRef.current.onended = () => {
                    URL.revokeObjectURL(url); // Clean up
                    resolve();
                };
                ttsAudioRef.current.onerror = () => {
                    console.error("Audio Playback Failed");
                    resolve();
                };

                // Play
                ttsAudioRef.current.play().catch(e => {
                    console.error("Play prevented", e);
                    resolve();
                });
            });

        } catch (e) {
            console.error("TTS Fetch Error:", e);
            // Wait a bit so it doesn't just flash through
            await wait(1000);
        }
    };

    const playAudioUntilEnd = (audio) => {
        return new Promise(resolve => {
            if (!isRunningRef.current) { resolve(); return; }
            audio.currentTime = 0;
            audio.play().catch(() => resolve());
            audio.onended = resolve;
        });
    };

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const fadeIn = (audio, max) => {
        let v = 0; audio.volume = 0;
        let i = setInterval(() => { if (v < max) { v += 0.01; audio.volume = v; } else clearInterval(i); }, 100);
    };

    const fadeOut = (audio) => {
        let i = setInterval(() => { if (audio.volume > 0.01) audio.volume -= 0.01; else { clearInterval(i); audio.pause(); } }, 100);
    };

    const startBroadcast = async () => {
        if (isRunning) return;

        await unlockAudio();
        setIsRunning(true);
        isRunningRef.current = true;
        setStatus("ON AIR");
        setStatusColor("#e74c3c");

        try {
            bgmHeadRef.current.volume = 0.1;
            bgmDetailRef.current.volume = 0.1;

            const lang = newsData.language || 'ml';

            // 1. Intro
            const introText = lang === 'en' ? "Welcome, here are the top stories..." :
                lang === 'hi' ? "നമസ്കാരം (Namaste), मुख्य समाचार..." : // Fallback/Mixed
                    lang === 'ta' ? "Vanakkam, mukkiya seithigal..." :
                        "നമസ്കാരം, പ്രധാന വാർത്തകൾ..."; // Default Malayalam

            updatePrompter(introText);
            await playBackendTTS(introText);
            await playAudioUntilEnd(bgmIntroRef.current);

            // 2. Headlines
            updatePrompter("Headlines...");
            bgmHeadRef.current.currentTime = 0;
            bgmHeadRef.current.play();

            if (newsData.headlines) {
                for (let line of newsData.headlines) {
                    if (!isRunningRef.current) return;
                    updatePrompter(line);
                    await playBackendTTS(line);
                    await wait(600);
                }
            }
            bgmHeadRef.current.pause();

            // 3. Details
            const detailText = lang === 'en' ? "News in detail..." :
                lang === 'hi' ? "വിസ്തार से खबरें..." :
                    lang === 'ta' ? "Seithigal virivaaga..." :
                        "വാർത്തകൾ വിശദമായി...";

            updatePrompter(detailText);
            await playBackendTTS(detailText);

            bgmDetailRef.current.currentTime = 0;
            bgmDetailRef.current.volume = 0;
            bgmDetailRef.current.play();
            fadeIn(bgmDetailRef.current, 0.1);
            await wait(1000);

            if (newsData.details) {
                for (let line of newsData.details) {
                    if (!isRunningRef.current) return;
                    updatePrompter(line);
                    await playBackendTTS(line);
                    await wait(800);
                }
            }

            // 4. Outro
            const outroText = lang === 'en' ? "That concludes the news. Thank you." :
                lang === 'hi' ? "समाचार समाप्त हुए. धन्यवाद." :
                    lang === 'ta' ? "Seithigal mudindhana. Nandri." :
                        "വാർത്തകൾ പൂർണ്ണമാകുന്നു. നന്ദി, നമസ്കാരം.";

            updatePrompter(outroText);
            await playBackendTTS(outroText);
            fadeOut(bgmDetailRef.current);
            await playAudioUntilEnd(bgmIntroRef.current);

            stopImmediately();

        } catch (err) {
            console.error(err);
            stopImmediately();
        }
    };

    const stopImmediately = () => {
        setIsRunning(false);
        isRunningRef.current = false;

        // Stop all audio
        bgmIntroRef.current.pause();
        bgmHeadRef.current.pause();
        bgmDetailRef.current.pause();
        ttsAudioRef.current.pause();

        setStatus("Complete");
        setStatusColor("#95a5a6");
        updatePrompter("Click 'Go Live' to listen.");
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
                <span className="status-badge" style={{
                    background: statusColor,
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontWeight: 'bold'
                }}>
                    {status}
                </span>
            </div>

            <div id="teleprompter" style={{
                background: '#1a1a1a',
                color: '#e0e0e0',
                padding: '30px',
                borderRadius: '12px',
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                lineHeight: '1.6',
                minHeight: '150px',
                margin: '20px 0',
                border: '1px solid #333',
                borderLeft: prompterText === "Click 'Go Live' to listen." ? 'none' : '5px solid #27ae60'
            }}>
                {prompterText}
            </div>

            <div className="controls" style={{ marginTop: '30px' }}>
                {!isRunning ? (
                    <button onClick={startBroadcast} className="btn-sm" style={{ backgroundColor: '#e74c3c', border: 'none', fontSize: '1.1rem', padding: '12px 30px' }}>
                        🔴 Go Live
                    </button>
                ) : (
                    <button onClick={stopImmediately} className="btn-sm btn-outline" style={{ marginLeft: '10px' }}>
                        ⏹ Stop
                    </button>
                )}
            </div>
            {onExit && <button onClick={onExit} className="btn-sm btn-outline" style={{ marginTop: '2rem' }}>Back</button>}
        </div>
    );
};

export default NewsPlayer;
