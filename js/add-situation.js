document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // Elements
    // =========================================

    const textModeButton =
        document.getElementById(
            "textModeButton"
        );

    const audioModeButton =
        document.getElementById(
            "audioModeButton"
        );

    const textMode =
        document.getElementById(
            "textMode"
        );

    const audioMode =
        document.getElementById(
            "audioMode"
        );


    const titleInput =
        document.getElementById(
            "situationTitle"
        );

    const descriptionInput =
        document.getElementById(
            "situationDescription"
        );

    const categoryInput =
        document.getElementById(
            "situationCategory"
        );

    const dateInput =
        document.getElementById(
            "situationDate"
        );

    const tagsInput =
        document.getElementById(
            "situationTags"
        );

    const feelingInput =
        document.getElementById(
            "situationFeeling"
        );

    const reflectionInput =
        document.getElementById(
            "situationReflection"
        );


    const descriptionCounter =
        document.getElementById(
            "descriptionCounter"
        );


    const recordButton =
        document.getElementById(
            "recordButton"
        );

    const recordButtonText =
        document.getElementById(
            "recordButtonText"
        );

    const recordButtonIcon =
        document.getElementById(
            "recordButtonIcon"
        );

    const recordingTimer =
        document.getElementById(
            "recordingTimer"
        );

    const recordingTitle =
        document.getElementById(
            "recordingTitle"
        );

    const recordingDescription =
        document.getElementById(
            "recordingDescription"
        );

    const microphoneCircle =
        document.getElementById(
            "microphoneCircle"
        );


    const audioFileInput =
        document.getElementById(
            "audioFileInput"
        );

    const audioPreview =
        document.getElementById(
            "audioPreview"
        );

    const audioPlayer =
        document.getElementById(
            "audioPlayer"
        );

    const deleteAudioButton =
        document.getElementById(
            "deleteAudioButton"
        );


    const saveDraftButton =
        document.getElementById(
            "saveDraftButton"
        );

    const saveAnalyzeButton =
        document.getElementById(
            "saveAnalyzeButton"
        );

    const cancelButton =
        document.getElementById(
            "cancelButton"
        );


    // =========================================
    // State
    // =========================================

    let currentMode = "text";

    let mediaRecorder = null;

    let audioChunks = [];

    let audioBlob = null;

    let audioStream = null;

    let recordingInterval = null;

    let recordingSeconds = 0;


    // =========================================
    // Default Date
    // =========================================

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    dateInput.value = today;


    // =========================================
    // Input Mode
    // =========================================

    function setMode(mode) {

        currentMode = mode;

        if (mode === "text") {

            textModeButton.classList.add(
                "active"
            );

            audioModeButton.classList.remove(
                "active"
            );

            textMode.classList.remove(
                "hidden"
            );

            audioMode.classList.add(
                "hidden"
            );

        } else {

            audioModeButton.classList.add(
                "active"
            );

            textModeButton.classList.remove(
                "active"
            );

            audioMode.classList.remove(
                "hidden"
            );

            textMode.classList.add(
                "hidden"
            );
        }
    }


    textModeButton.addEventListener(
        "click",
        () => {
            setMode("text");
        }
    );


    audioModeButton.addEventListener(
        "click",
        () => {
            setMode("audio");
        }
    );


    // =========================================
    // Description Counter
    // =========================================

    descriptionInput.addEventListener(
        "input",
        () => {

            const length =
                descriptionInput.value.length;

            descriptionCounter.textContent =
                `${length} / 3000`;
        }
    );


    // =========================================
    // Recording Timer
    // =========================================

    function updateTimer() {

        const minutes =
            Math.floor(
                recordingSeconds / 60
            );

        const seconds =
            recordingSeconds % 60;

        recordingTimer.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }


    function startTimer() {

        recordingSeconds = 0;

        updateTimer();

        recordingInterval =
            setInterval(() => {

                recordingSeconds++;

                updateTimer();

            }, 1000);
    }


    function stopTimer() {

        clearInterval(
            recordingInterval
        );

        recordingInterval = null;
    }


    // =========================================
    // Start Recording
    // =========================================

    async function startRecording() {

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            alert(
                "المتصفح لا يدعم تسجيل الصوت."
            );

            return;
        }


        try {

            audioStream =
                await navigator
                    .mediaDevices
                    .getUserMedia({
                        audio: true
                    });


            audioChunks = [];


            mediaRecorder =
                new MediaRecorder(
                    audioStream
                );


            mediaRecorder.addEventListener(
                "dataavailable",
                event => {

                    if (
                        event.data &&
                        event.data.size > 0
                    ) {

                        audioChunks.push(
                            event.data
                        );
                    }
                }
            );


            mediaRecorder.addEventListener(
                "stop",
                createAudioBlob
            );


            mediaRecorder.start();


            startTimer();


            recordButton.classList.add(
                "recording"
            );

            recordButtonIcon.textContent =
                "■";

            recordButtonText.textContent =
                "إيقاف التسجيل";


            recordingTitle.textContent =
                "جاري التسجيل...";


            recordingDescription.textContent =
                "تحدث بحرية عن الموقف. اضغط مرة أخرى عند الانتهاء.";


            microphoneCircle.classList.add(
                "recording"
            );

        } catch (error) {

            console.error(
                "Microphone error:",
                error
            );

            alert(
                "لم نتمكن من الوصول إلى الميكروفون. تأكد من السماح باستخدام الميكروفون."
            );
        }
    }


    // =========================================
    // Stop Recording
    // =========================================

    function stopRecording() {

        if (
            !mediaRecorder ||
            mediaRecorder.state !== "recording"
        ) {
            return;
        }


        mediaRecorder.stop();


        stopTimer();


        if (audioStream) {

            audioStream
                .getTracks()
                .forEach(track => {
                    track.stop();
                });

            audioStream = null;
        }


        recordButton.classList.remove(
            "recording"
        );

        recordButtonIcon.textContent =
            "●";

        recordButtonText.textContent =
            "بدء التسجيل";


        recordingTitle.textContent =
            "تم تسجيل الموقف";


        recordingDescription.textContent =
            "يمكنك تشغيل التسجيل أو حذفه وإعادة التسجيل.";


        microphoneCircle.classList.remove(
            "recording"
        );
    }


    // =========================================
    // Create Audio Blob
    // =========================================

    function createAudioBlob() {

        if (!audioChunks.length) {
            return;
        }


        audioBlob =
            new Blob(
                audioChunks,
                {
                    type:
                        mediaRecorder.mimeType ||
                        "audio/webm"
                }
            );


        showAudioPreview(
            audioBlob
        );
    }


    // =========================================
    // Show Audio Preview
    // =========================================

    function showAudioPreview(blob) {

        const audioUrl =
            URL.createObjectURL(
                blob
            );


        audioPlayer.src =
            audioUrl;


        audioPreview.classList.remove(
            "hidden"
        );
    }


    // =========================================
    // Record Button
    // =========================================

    recordButton.addEventListener(
        "click",
        async () => {

            if (
                mediaRecorder &&
                mediaRecorder.state ===
                    "recording"
            ) {

                stopRecording();

            } else {

                await startRecording();
            }
        }
    );


    // =========================================
    // Audio File Upload
    // =========================================

    audioFileInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "audio/"
                )
            ) {

                alert(
                    "من فضلك اختر ملفًا صوتيًا."
                );

                return;
            }


            audioBlob = file;


            showAudioPreview(
                file
            );


            recordingTitle.textContent =
                "تم اختيار الملف الصوتي";


            recordingDescription.textContent =
                "يمكنك تشغيل الملف أو حذفه واختيار ملف آخر.";
        }
    );


    // =========================================
    // Delete Audio
    // =========================================

    deleteAudioButton.addEventListener(
        "click",
        () => {

            audioBlob = null;

            audioChunks = [];

            audioPlayer.pause();

            audioPlayer.removeAttribute(
                "src"
            );

            audioPlayer.load();


            audioPreview.classList.add(
                "hidden"
            );


            audioFileInput.value = "";


            recordingSeconds = 0;

            updateTimer();


            recordingTitle.textContent =
                "اضغط وابدأ في الحديث";


            recordingDescription.textContent =
                "يمكنك ذكر ما حدث، شعورك، وما كنت تتمنى فعله بشكل مختلف.";
        }
    );


    // =========================================
    // Validate Text Mode
    // =========================================

    function validateTextMode() {

        const title =
            titleInput.value.trim();

        const description =
            descriptionInput.value.trim();

        const category =
            categoryInput.value;


        if (title.length < 3) {

            alert(
                "اكتب عنوانًا للموقف."
            );

            titleInput.focus();

            return false;
        }


        if (description.length < 10) {

            alert(
                "اكتب تفاصيل أكثر عن الموقف."
            );

            descriptionInput.focus();

            return false;
        }


        if (!category) {

            alert(
                "اختر تصنيف الموقف."
            );

            categoryInput.focus();

            return false;
        }


        return true;
    }


    // =========================================
    // Validate Audio Mode
    // =========================================

    function validateAudioMode() {

        if (!audioBlob) {

            alert(
                "سجّل الموقف صوتيًا أو اختر ملفًا صوتيًا أولًا."
            );

            return false;
        }


        return true;
    }


    // =========================================
    // Create Text Situation
    // =========================================

    function createTextSituation(
        status
    ) {

        const tags =
            tagsInput.value
                .split(",")
                .map(tag => tag.trim())
                .filter(Boolean);


        return {

            id:
                Date.now(),

            input_type:
                "text",

            title:
                titleInput.value.trim(),

            description:
                descriptionInput.value.trim(),

            category:
                categoryInput.value,

            date:
                dateInput.value,

            tags,

            feeling:
                feelingInput.value.trim(),

            reflection:
                reflectionInput.value.trim(),

            status,

            created_at:
                new Date().toISOString()
        };
    }


    // =========================================
    // Create Audio Situation
    // =========================================

    function createAudioSituation(
        status
    ) {

        return {

            id:
                Date.now(),

            input_type:
                "audio",

            title:
                "",

            description:
                "",

            category:
                "",

            date:
                dateInput.value,

            tags: [],

            feeling:
                "",

            reflection:
                "",

            audio_status:
                "pending_transcription",

            audio_name:
                audioBlob.name ||
                `situation-${Date.now()}.webm`,

            audio_type:
                audioBlob.type,

            audio_size:
                audioBlob.size,

            status,

            created_at:
                new Date().toISOString()
        };
    }


    // =========================================
    // Save Situation
    // =========================================

    function saveSituation(
        status,
        analyze = false
    ) {

        let situation;


        // -------------------------------
        // Text
        // -------------------------------

        if (currentMode === "text") {

            if (!validateTextMode()) {
                return;
            }


            situation =
                createTextSituation(
                    status
                );

        }


        // -------------------------------
        // Audio
        // -------------------------------

        else {

            if (!validateAudioMode()) {
                return;
            }


            situation =
                createAudioSituation(
                    status
                );
        }


        // =================================
        // Existing Situations
        // =================================

        const existing =
            JSON.parse(
                localStorage.getItem(
                    "wsi_situations"
                )
            ) || [];


        existing.push(
            situation
        );


        localStorage.setItem(
            "wsi_situations",
            JSON.stringify(existing)
        );


        localStorage.setItem(
            "wsi_current_situation_id",
            String(
                situation.id
            )
        );


        // =================================
        // Redirect
        // =================================

        if (analyze) {

            localStorage.setItem(
                "wsi_analysis_status",
                "pending"
            );


            /*
             * IMPORTANT:
             *
             * For text:
             *   Situation → AI Analysis
             *
             * For audio:
             *   Situation → STT → Review Transcript
             *             → AI Analysis
             *
             * For now the prototype redirects
             * to AI analysis.
             */

            window.location.href =
                "ai-analysis.html";

        } else {

            window.location.href =
                "situations.html";
        }
    }


    // =========================================
    // Save Draft
    // =========================================

    saveDraftButton.addEventListener(
        "click",
        () => {

            saveSituation(
                "draft",
                false
            );
        }
    );


    // =========================================
    // Save + Analyze
    // =========================================

    saveAnalyzeButton.addEventListener(
        "click",
        () => {

            saveSituation(
                "pending_analysis",
                true
            );
        }
    );


    // =========================================
    // Cancel
    // =========================================

    cancelButton.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "هل تريد إلغاء إضافة الموقف؟"
                );


            if (confirmed) {

                window.location.href =
                    "situations.html";
            }
        }
    );

});