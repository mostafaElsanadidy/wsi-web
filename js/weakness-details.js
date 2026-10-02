document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const developmentTitle =
        document.getElementById("developmentTitle");

    const developmentDescription =
        document.getElementById("developmentDescription");

    const heroTitle =
        document.getElementById("heroTitle");

    const developmentCategory =
        document.getElementById("developmentCategory");

    const developmentStatus =
        document.getElementById("developmentStatus");

    const progressValue =
        document.getElementById("progressValue");

    const progressFill =
        document.getElementById("progressFill");

    const developmentExplanation =
        document.getElementById("developmentExplanation");

    const infoCategory =
        document.getElementById("infoCategory");

    const infoStatus =
        document.getElementById("infoStatus");

    const infoConfidence =
        document.getElementById("infoConfidence");

    const infoDate =
        document.getElementById("infoDate");

    const evidenceContainer =
        document.getElementById("evidenceSituations");


    // =====================================================
    // CATEGORY LABELS
    // =====================================================

    const categoryLabels = {

        communication: "التواصل",

        self_control: "التحكم الذاتي",

        work: "العمل",

        relationships: "العلاقات",

        social: "اجتماعي"

    };


    // =====================================================
    // GET KEY FROM URL
    // =====================================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const key =
        params.get("key");


    // =====================================================
    // READ DEVELOPMENT AREAS
    // =====================================================

    const developmentAreas =
        JSON.parse(
            localStorage.getItem(
                "wsi_development_areas"
            )
        ) || [];


    // =====================================================
    // FIND SELECTED AREA
    // =====================================================

    const area =
        developmentAreas.find(
            item => item.key === key
        );


    // =====================================================
    // INVALID AREA
    // =====================================================

    if (!area) {

        window.location.href =
            "my-weaknesses.html";

        return;
    }


    // =====================================================
    // BASIC DATA
    // =====================================================

    const title =
        area.title || "نقطة تطوير";


    const category =
        categoryLabels[area.category]
        || "نقطة تطوير";


    const progress =
        Math.max(
            0,
            Math.min(
                100,
                Number(area.progress || 0)
            )
        );


    // =====================================================
    // STATUS
    // =====================================================

    let statusText = "نشطة";


    if (
        area.status === "improved"
        || progress >= 100
    ) {

        statusText = "تم تطويرها";

    } else if (
        area.status === "in_progress"
        || progress > 0
    ) {

        statusText = "قيد التطوير";

    }


    // =====================================================
    // UPDATE HEADER
    // =====================================================

    developmentTitle.textContent =
        title;


    heroTitle.textContent =
        title;


    developmentCategory.textContent =
        category;


    developmentDescription.textContent =
        "نقطة تطوير اخترت متابعتها والعمل عليها.";


    developmentStatus.textContent =
        statusText;


    // =====================================================
    // PROGRESS
    // =====================================================

    progressValue.textContent =
        `${progress}%`;


    progressFill.style.width =
        `${progress}%`;


    // =====================================================
    // INFO
    // =====================================================

    infoCategory.textContent =
        category;


    infoStatus.textContent =
        statusText;


    infoConfidence.textContent =
        `${Math.round(
            Number(area.confidence || 0) * 100
        )}%`;


    infoDate.textContent =
        formatDate(area.confirmed_at);


    // =====================================================
    // EXPLANATION
    // =====================================================

    const explanations = {

        poor_active_listening:
            "أحيانًا نحتاج إلى إعطاء الآخرين مساحة للتحدث حتى النهاية قبل أن نرد. تطوير هذه المهارة قد يساعد على فهم الآخرين بشكل أفضل.",

        reaction_control:
            "في بعض المواقف قد يكون من المفيد أخذ لحظة قصيرة قبل الرد، خصوصًا عندما تكون المشاعر قوية.",

        calm_expression:
            "التعبير عن الرأي بهدوء يمكن أن يساعد على توصيل الفكرة بوضوح وتقليل سوء الفهم أثناء النقاش."

    };


    developmentExplanation.textContent =
        explanations[area.key]
        || "هذه نقطة يمكنك متابعتها وملاحظة تطورها من خلال المواقف اليومية.";


    // =====================================================
    // EVIDENCE
    // =====================================================

    renderEvidence(area);


    // =====================================================
    // RENDER EVIDENCE
    // =====================================================

    function renderEvidence(area) {

        evidenceContainer.innerHTML = "";


        const situations =
            JSON.parse(
                localStorage.getItem(
                    "wsi_situations"
                )
            ) || [];


        /*
         * For the MVP we show situations related
         * to the same category.
         *
         * Later the backend will return actual
         * AI evidence IDs.
         */

        const relatedSituations =
            situations.filter(
                situation =>
                    situation.category === area.category
            );


        if (relatedSituations.length === 0) {

            evidenceContainer.innerHTML = `

                <div class="evidence-item">

                    <div class="evidence-icon">
                        ℹ
                    </div>

                    <div class="evidence-content">

                        <h3>
                            لا توجد مواقف مرتبطة بعد
                        </h3>

                        <p>
                            عند تسجيل مواقف جديدة يمكن
                            استخدامها لمتابعة هذه النقطة
                            بشكل أفضل.
                        </p>

                    </div>

                </div>

            `;

            return;
        }


        relatedSituations
            .slice(0, 5)
            .forEach(situation => {

                const item =
                    document.createElement("div");


                item.className =
                    "evidence-item";


                item.innerHTML = `

                    <div class="evidence-icon">
                        ◫
                    </div>

                    <div class="evidence-content">

                        <h3>
                            ${escapeHtml(
                                situation.title
                            )}
                        </h3>

                        <p>
                            موقف مرتبط بتصنيف
                            ${escapeHtml(
                                categoryLabels[
                                    situation.category
                                ] || "عام"
                            )}
                        </p>

                    </div>

                    <span class="evidence-date">
                        ${formatDate(
                            situation.created_at
                            || situation.date
                        )}
                    </span>

                `;


                evidenceContainer.appendChild(item);

            });

    }


    // =====================================================
    // DATE FORMAT
    // =====================================================

    function formatDate(value) {

        if (!value) {
            return "—";
        }


        const date =
            new Date(value);


        if (Number.isNaN(date.getTime())) {
            return "—";
        }


        return new Intl.DateTimeFormat(
            "ar-EG",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        ).format(date);

    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

});