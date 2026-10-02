document.addEventListener("DOMContentLoaded", () => {

    const cards =
        document.querySelectorAll(
            ".suggestion-card"
        );


    const selectedCount =
        document.getElementById(
            "selectedCount"
        );


    const confirmButton =
        document.getElementById(
            "confirmButton"
        );


    const ignoreButton =
        document.getElementById(
            "ignoreButton"
        );


    /*
     * Temporary AI suggestions.
     *
     * Later these will come from:
     *
     * GET /api/ai-analysis/{id}
     */

    const suggestions = [

        {
            key: "poor_active_listening",

            title:
                "الاستماع للآخرين بشكل أفضل",

            category:
                "communication",

            confidence: 0.90,

            status:"active"

        },

        {
            key: "reaction_control",

            title:
                "التحكم في رد الفعل أثناء الخلاف",

            category:
                "self_control",

            confidence: 0.76,
            status:"inactive"

        },

        {
            key: "calm_expression",

            title:
                "التعبير عن الرأي بهدوء",

            category:
                "communication",

            confidence: 0.68,
            status:"active"

        }

    ];


    /* =====================================
       Update Selected Count
    ====================================== */

    function updateSelectedCount() {

        const selected = document.querySelectorAll(
            ".suggestion-card input[type='checkbox']:checked"
        );

        selectedCount.textContent = `${selected.length} محدد`;

        cards.forEach(card => {

            const checkbox = card.querySelector(
                "input[type='checkbox']"
            );

            if (!checkbox) return;

            card.classList.toggle(
                "selected",
                checkbox.checked
            );
            
        });
    }


    /* =====================================
       Checkbox Events
    ====================================== */

    cards.forEach(card => {

        const checkbox =
            card.querySelector("input");


        checkbox.addEventListener(
            "change",
            updateSelectedCount
        );

    });


    updateSelectedCount();


    /* =====================================
       Confirm
    ====================================== */

    confirmButton.addEventListener(
        "click",
        () => {

            const selected =
                [];


            cards.forEach(
                (card, index) => {

                    const checkbox =
                        card.querySelector(
                            "input"
                        );


                    if (
                        checkbox.checked
                    ) {

                        selected.push(
                            suggestions[index]
                        );

                    }

                }
            );


            if (
                selected.length === 0
            ) {

                alert(
                    "اختر نقطة تطوير واحدة على الأقل."
                );

                return;

            }


            /*
             * IMPORTANT:
             *
             * This is where user confirmation
             * happens.
             *
             * AI did NOT save these automatically.
             */


            const existing =
                JSON.parse(
                    localStorage.getItem(
                        "wsi_development_areas"
                    )
                ) || [];


            // =====================================
            // Get currently selected suggestions
            // =====================================

            const selectedKeys = selected.map(
                suggestion => suggestion.key
            );


            // =====================================
            // Remove unchecked suggestions
            // =====================================

            const updated = existing.filter(
                item =>
                    selectedKeys.includes(item.key)
            );



            // =====================================
            // Add newly checked suggestions
            // =====================================

            selected.forEach(
                suggestion => {

                    const alreadyExists =
                    //existing.some(
                    updated.some(
                        item =>
                            item.key ===
                            suggestion.key
                    );

                    if (
                        !alreadyExists
                    ) {

                        // existing.push({
                    updated.push({  
                            id: Date.now() +
                                Math.random(),

                            key:
                                suggestion.key,

                            title:
                                suggestion.title,

                            category:
                                suggestion.category,

                            confidence:
                                suggestion.confidence,

                            progress: 0,

                            status:
                                suggestion.status || "active",

                            confirmed_at:
                                new Date()
                                    .toISOString()

                        });

                    }

                }
            );

            localStorage.setItem(
                "wsi_development_areas",
                JSON.stringify(updated)
            );


            /*
             * Mark analysis as reviewed.
             */

            localStorage.setItem(
                "wsi_analysis_status",
                "confirmed"
            );


            window.location.href =
                "my-weaknesses.html";

        }
    );


    /* =====================================
       Ignore
    ====================================== */

    ignoreButton.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "هل تريد تجاهل هذه الاقتراحات؟"
                );


            if (!confirmed) {
                return;
            }


            localStorage.setItem(
                "wsi_analysis_status",
                "ignored"
            );


            window.location.href =
                "situations.html";

        }
    );

});