document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const totalAreasElement =
        document.getElementById("totalAreas");

    const totalSituationsElement =
        document.getElementById("totalSituations");

    const totalImprovedElement =
        document.getElementById("totalImproved");

    const overallProgressElement =
        document.getElementById("overallProgress");

    const topAreasList =
        document.getElementById("topAreasList");

    const chartLinePath =
        document.getElementById("chartLinePath");

    const chartAreaPath =
        document.getElementById("chartAreaPath");

    const chartPoints =
        document.getElementById("chartPoints");

    const chartLabels =
        document.getElementById("chartLabels");

    const periodSelect =
        document.getElementById("progressPeriod");


    // =====================================================
    // READ DATA
    // =====================================================

    const developmentAreas =
        JSON.parse(
            localStorage.getItem(
                "wsi_development_areas"
            )
        ) || [];


    const situations =
        JSON.parse(
            localStorage.getItem(
                "wsi_situations"
            )
        ) || [];


    // =====================================================
    // SUMMARY
    // =====================================================

    const totalAreas =
        developmentAreas.length;


    const totalSituations =
        situations.length;


    const totalImproved =
        developmentAreas.filter(
            area =>
                area.status === "improved"
                ||
                Number(area.progress || 0) >= 100
        ).length;


    const overallProgress =
        totalAreas > 0
            ? Math.round(
                developmentAreas.reduce(
                    (sum, area) =>
                        sum +
                        Number(area.progress || 0),
                    0
                ) / totalAreas
            )
            : 0;


    totalAreasElement.textContent =
        totalAreas;


    totalSituationsElement.textContent =
        totalSituations;


    totalImprovedElement.textContent =
        totalImproved;


    overallProgressElement.textContent =
        `${overallProgress}%`;


    // =====================================================
    // TOP DEVELOPMENT AREAS
    // =====================================================

    renderTopAreas();


    // =====================================================
    // CHART
    // =====================================================

    renderChart(
        Number(periodSelect.value)
    );


    periodSelect.addEventListener(
        "change",
        () => {

            renderChart(
                Number(periodSelect.value)
            );

        }
    );


    // =====================================================
    // TOP AREAS
    // =====================================================

    function renderTopAreas() {

        topAreasList.innerHTML = "";


        if (developmentAreas.length === 0) {

            topAreasList.innerHTML = `

                <div class="top-areas-empty">

                    لا توجد نقاط تطوير مؤكدة حتى الآن.

                    <br>

                    قم بتحليل موقف ثم اختر
                    النقاط التي تريد متابعتها.

                </div>

            `;

            return;
        }


        const sortedAreas =
            [...developmentAreas]
                .sort(
                    (a, b) =>
                        Number(b.progress || 0)
                        -
                        Number(a.progress || 0)
                )
                .slice(0, 5);


        sortedAreas.forEach(area => {

            const progress =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(area.progress || 0)
                    )
                );


            const item =
                document.createElement("div");


            item.className =
                "top-area-item";


            item.innerHTML = `

                <div class="top-area-header">

                    <div class="top-area-title">

                        <div class="top-area-icon">
                            ◎
                        </div>

                        <span>
                            ${escapeHtml(
                                area.title
                            )}
                        </span>

                    </div>

                    <span class="top-area-value">
                        ${progress}%
                    </span>

                </div>


                <div class="top-area-progress">

                    <div
                        class="top-area-progress-fill"
                        style="width:${progress}%"
                    ></div>

                </div>

            `;


            topAreasList.appendChild(item);

        });

    }


    // =====================================================
    // CHART
    // =====================================================

    function renderChart(monthsCount) {

        /*
         * MVP:
         *
         * We don't have historical progress records yet.
         *
         * Therefore we generate a simple timeline based
         * on the current development progress.
         *
         * Later this will come from:
         *
         * development_progress_logs
         *
         * or API endpoint.
         */


        const currentProgress =
            overallProgress;


        const chartValues =
            generateChartValues(
                monthsCount,
                currentProgress
            );


        drawChart(
            chartValues
        );

    }


    // =====================================================
    // GENERATE MVP CHART DATA
    // =====================================================

    function generateChartValues(
        count,
        current
    ) {

        if (count <= 0) {
            return [];
        }


        if (current === 0) {

            return Array(count)
                .fill(0);

        }


        const values = [];


        const start =
            Math.max(
                0,
                current - 30
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const ratio =
                count === 1
                    ? 1
                    : i / (count - 1);


            const value =
                Math.round(
                    start +
                    (
                        current - start
                    ) * ratio
                );


            values.push(
                value
            );

        }


        return values;

    }


    // =====================================================
    // DRAW SVG CHART
    // =====================================================

    function drawChart(values) {

        if (!values.length) {
            return;
        }


        const width = 800;

        const height = 300;


        const paddingX = 20;


        const chartWidth =
            width -
            (paddingX * 2);


        const chartHeight =
            height -
            20;


        const points =
            values.map(
                (value, index) => {

                    const x =
                        values.length === 1
                            ? width / 2
                            : paddingX +
                              (
                                index /
                                (values.length - 1)
                              ) *
                              chartWidth;


                    const y =
                        chartHeight -
                        (
                            value / 100
                        ) *
                        chartHeight;


                    return {
                        x,
                        y,
                        value
                    };

                }
            );


        // =================================================
        // LINE PATH
        // =================================================

        const linePath =
            points
                .map(
                    (point, index) =>
                        `${
                            index === 0
                                ? "M"
                                : "L"
                        } ${point.x} ${point.y}`
                )
                .join(" ");


        chartLinePath.setAttribute(
            "d",
            linePath
        );


        // =================================================
        // AREA PATH
        // =================================================

        const first =
            points[0];


        const last =
            points[points.length - 1];


        const areaPath =
            `${linePath}
             L ${last.x} ${chartHeight}
             L ${first.x} ${chartHeight}
             Z`;


        chartAreaPath.setAttribute(
            "d",
            areaPath
        );


        // =================================================
        // POINTS
        // =================================================

        chartPoints.innerHTML = "";


        points.forEach(
            point => {

                const circle =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "circle"
                    );


                circle.setAttribute(
                    "cx",
                    point.x
                );


                circle.setAttribute(
                    "cy",
                    point.y
                );


                circle.setAttribute(
                    "r",
                    "5"
                );


                circle.setAttribute(
                    "class",
                    "chart-point"
                );


                chartPoints.appendChild(
                    circle
                );

            }
        );


        // =================================================
        // LABELS
        // =================================================

        renderChartLabels(
            values.length
        );

    }


    // =====================================================
    // CHART LABELS
    // =====================================================

    function renderChartLabels(count) {

        chartLabels.innerHTML = "";


        const now =
            new Date();


        const labels = [];


        for (
            let i = count - 1;
            i >= 0;
            i--
        ) {

            const date =
                new Date(
                    now.getFullYear(),
                    now.getMonth() - i,
                    1
                );


            labels.push(
                new Intl.DateTimeFormat(
                    "ar-EG",
                    {
                        month: "short"
                    }
                ).format(date)
            );

        }


        labels.forEach(
            label => {

                const span =
                    document.createElement(
                        "span"
                    );


                span.textContent =
                    label;


                chartLabels.appendChild(
                    span
                );

            }
        );

    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

});