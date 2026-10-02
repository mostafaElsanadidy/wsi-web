document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("situationForm");

    const title =
        document.getElementById("situationTitle");

    const description =
        document.getElementById("situationDescription");

    const category =
        document.getElementById("category");

    const date =
        document.getElementById("situationDate");

    const tags =
        document.getElementById("tags");

    const feeling =
        document.getElementById("feeling");

    const reflection =
        document.getElementById("reflection");

    const saveDraftButton =
        document.getElementById("saveDraftButton");

    const characterCount =
        document.getElementById("characterCount");


    /* =====================================
       Default Date
    ====================================== */

    if (!date.value) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        date.value = today;

    }


    /* =====================================
       Character Counter
    ====================================== */

    description.addEventListener(
        "input",
        () => {

            characterCount.textContent =
                `${description.value.length} / 3000`;

        }
    );


    /* =====================================
       Validation
    ====================================== */

    function clearErrors() {

        document
            .querySelectorAll(".field-error")
            .forEach(error => {

                error.textContent = "";

            });


        document
            .querySelectorAll(".input-error")
            .forEach(input => {

                input.classList.remove(
                    "input-error"
                );

            });

    }


    function showError(
        input,
        errorId,
        message
    ) {

        input.classList.add(
            "input-error"
        );


        document.getElementById(
            errorId
        ).textContent = message;

    }


    function validateForm() {

        clearErrors();

        let valid = true;


        if (
            title.value.trim().length < 3
        ) {

            showError(
                title,
                "titleError",
                "اكتب عنوانًا للموقف."
            );

            valid = false;

        }


        if (
            description.value.trim().length < 10
        ) {

            showError(
                description,
                "descriptionError",
                "اكتب تفاصيل أكثر عن الموقف."
            );

            valid = false;

        }


        if (!category.value) {

            showError(
                category,
                "categoryError",
                "اختر تصنيف الموقف."
            );

            valid = false;

        }


        return valid;

    }


    /* =====================================
       Collect Form Data
    ====================================== */

    function getFormData(status) {

        const tagList =
            tags.value
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);


        return {

            id: Date.now(),

            title:
                title.value.trim(),

            description:
                description.value.trim(),

            category:
                category.value,

            date:
                date.value,

            tags:
                tagList,

            feeling:
                feeling.value.trim(),

            reflection:
                reflection.value.trim(),

            status:
                status,

            created_at:
                new Date().toISOString()

        };

    }


    /* =====================================
       Save Situation
    ====================================== */

    function saveSituation(status) {

        const situation =
            getFormData(status);


        const existing =
            JSON.parse(
                localStorage.getItem(
                    "wsi_situations"
                )
            ) || [];


        existing.push(situation);


        localStorage.setItem(
            "wsi_situations",
            JSON.stringify(existing)
        );


        return situation;

    }


    /* =====================================
       Save Draft
    ====================================== */

    saveDraftButton.addEventListener(
        "click",
        () => {

            clearErrors();


            if (
                title.value.trim() === "" &&
                description.value.trim() === ""
            ) {

                showError(
                    title,
                    "titleError",
                    "اكتب عنوانًا أو تفاصيل قبل حفظ المسودة."
                );

                return;

            }


            const situation =
                saveSituation("draft");


            alert(
                "تم حفظ الموقف كمسودة بنجاح."
            );


            window.location.href =
                "situations.html";

        }
    );


    /* =====================================
       Submit
    ====================================== */

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (!validateForm()) {

                return;

            }


            const situation =
                saveSituation("pending_analysis");


            /*
             * Temporary frontend flow.
             *
             * Later this will become:
             *
             * POST /api/situations
             *
             */


            localStorage.setItem(
                "wsi_current_situation_id",
                situation.id
            );


            window.location.href =
                "ai-analysis.html";

        }
    );

});