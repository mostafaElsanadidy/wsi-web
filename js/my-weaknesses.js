document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById(
        "developmentAreasContainer"
    );

    const emptyState = document.getElementById(
        "emptyDevelopmentState"
    );

    const activeCountElement = document.getElementById(
        "activeCount"
    );

    const inDevelopmentCountElement = document.getElementById(
        "inDevelopmentCount"
    );

    const improvedCountElement = document.getElementById(
        "improvedCount"
    );


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
    // READ DATA
    // =====================================================

    const developmentAreas =
        JSON.parse(
            localStorage.getItem(
                "wsi_development_areas"
            )
        ) || [];
        let statusText = "نشطة";


    // =====================================================
    // UPDATE SUMMARY
    // =====================================================

    const activeCount =
        developmentAreas
        // .filter(
        //     item => item.status === "active"
        // )
        .length;


    const inDevelopmentCount =
        developmentAreas.filter(
            item =>
                item.status === "in_progress" ||
                (
                    item.status === "active" &&
                    Number(item.progress || 0) > 0
                )
        ).length;


    const improvedCount =
        developmentAreas.filter(
            item =>
                item.status === "improved" ||
                Number(item.progress || 0) >= 100
        ).length;


    activeCountElement.textContent =
        activeCount;


    inDevelopmentCountElement.textContent =
        inDevelopmentCount;


    improvedCountElement.textContent =
        improvedCount;


    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (developmentAreas.length === 0) {

        container.style.display = "none";

        emptyState.style.display = "block";

        return;
    }


    // =====================================================
    // CREATE CARD
    // =====================================================

    developmentAreas.forEach(area => {

        const progress =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(area.progress || 0)
                )
            );


        const category =
            categoryLabels[area.category]
            || "نقطة تطوير";


        let statusClass = "active";

        let statusText = "نشطة";


        if (
            area.status === "improved"
            || progress >= 100
        ) {

            statusClass = "improved";

            statusText = "تم تطويرها";

        } else if (
            area.status === "in_progress"
            || progress > 0
        ) {

            statusClass = "in-progress";

            statusText = "قيد التطوير";

        }


        // =================================================
        // CARD
        // =================================================

        const card =
            document.createElement("article");


        card.className =
            "development-area-card";


        card.innerHTML = `

            <div class="development-card-top">

                <div class="development-card-title">

                    <div class="development-card-icon">
                        ◎
                    </div>

                    <div>

                        <h3>
                            ${escapeHtml(area.title)}
                        </h3>

                        <div class="development-category">
                            ${escapeHtml(category)}
                        </div>

                    </div>

                </div>


                <span class="development-status ${statusClass}">
                    ${statusText}
                </span>

            </div>


            <p class="development-card-description">

                نقطة تطوير اخترت متابعتها والعمل عليها
                بناءً على اقتراح سابق من تحليل أحد المواقف.

            </p>


            <div class="development-progress-header">

                <span class="development-progress-label">
                    مستوى التقدم
                </span>

                <span class="development-progress-value">
                    ${progress}%
                </span>

            </div>


            <div class="development-progress-bar">

                <div
                    class="development-progress-fill"
                    style="width: ${progress}%"
                ></div>

            </div>


            <div class="development-card-footer">

                <span class="development-confidence">

                    ثقة الاقتراح:
                    ${Math.round(
                        Number(area.confidence || 0) * 100
                    )}%

                </span>


                <a
                    href="weakness-details.html?key=${encodeURIComponent(area.key)}"
                    class="development-details-link"
                >
                    عرض التفاصيل →
                </a>

            </div>

        `;


        container.appendChild(card);

    });


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

});active