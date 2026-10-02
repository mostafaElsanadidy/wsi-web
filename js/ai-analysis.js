document.addEventListener("DOMContentLoaded", () => {

    const progressFill =
        document.getElementById(
            "analysisProgressFill"
        );

    const progressPercent =
        document.getElementById(
            "analysisPercent"
        );

    const title =
        document.getElementById(
            "analysisTitle"
        );

    const description =
        document.getElementById(
            "analysisDescription"
        );

    const icon =
        document.getElementById(
            "analysisIcon"
        );


    const step1 =
        document.getElementById("step1");

    const step2 =
        document.getElementById("step2");

    const step3 =
        document.getElementById("step3");


    /*
     * Get the current situation.
     */

    const situationId =
        localStorage.getItem(
            "wsi_current_situation_id"
        );


    const situations =
        JSON.parse(
            localStorage.getItem(
                "wsi_situations"
            )
        ) || [];


    const situation =
        situations.find(
            item =>
                String(item.id) ===
                String(situationId)
        );


    /*
     * If there is no situation,
     * return to situations page.
     */

    if (!situation) {

        window.location.href =
            "situations.html";

        return;

    }


    /*
     * Temporary analysis simulation.
     *
     * Later this will become:
     *
     * POST /api/ai-analysis
     */

    const steps = [

        {
            percent: 25,

            title:
                "جاري فهم تفاصيل الموقف",

            description:
                "يتم قراءة السياق والأحداث التي سجلتها.",

            step: 1

        },

        {
            percent: 55,

            title:
                "جاري استخراج المؤشرات",

            description:
                "يتم البحث عن أنماط قد تكون مرتبطة بالموقف.",

            step: 2

        },

        {
            percent: 80,

            title:
                "جاري إعداد الاقتراحات",

            description:
                "يتم تجهيز اقتراحات يمكنك مراجعتها.",

            step: 3

        },

        {
            percent: 100,

            title:
                "اكتمل التحليل",

            description:
                "تم تجهيز الاقتراحات لمراجعتها.",

            step: 3

        }

    ];


    function updateStep(stepNumber) {

        [step1, step2, step3]
            .forEach(step => {

                step.classList.remove(
                    "active",
                    "completed"
                );

            });


        if (stepNumber >= 1) {

            step1.classList.add(
                "completed"
            );

        }


        if (stepNumber === 1) {

            step1.classList.remove(
                "completed"
            );

            step1.classList.add(
                "active"
            );

        }


        if (stepNumber >= 2) {

            step2.classList.add(
                "active"
            );

        }


        if (stepNumber >= 3) {

            step2.classList.remove(
                "active"
            );

            step2.classList.add(
                "completed"
            );

            step3.classList.add(
                "active"
            );

        }


        if (stepNumber === 3) {

            step3.classList.remove(
                "active"
            );

            step3.classList.add(
                "completed"
            );

        }

    }


    function updateProgress(data) {

        progressFill.style.width =
            `${data.percent}%`;

        progressPercent.textContent =
            `${data.percent}%`;

        title.textContent =
            data.title;

        description.textContent =
            data.description;

        updateStep(data.step);

    }


    let index = 0;


    function runAnalysis() {

        const current =
            steps[index];


        updateProgress(current);


        if (
            index <
            steps.length - 1
        ) {

            index++;

            setTimeout(
                runAnalysis,
                1800
            );

        } else {

            /*
             * Save temporary analysis state.
             */

            localStorage.setItem(
                "wsi_analysis_status",
                "completed"
            );


            setTimeout(() => {

                window.location.href =
                    "review-suggestions.html";

            }, 1200);

        }

    }


    runAnalysis();

});