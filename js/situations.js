document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("situationSearch");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const rows =
        document.querySelectorAll(
            "#situationsTableBody tr"
        );


    function filterSituations() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();

        const category =
            categoryFilter.value;

        const status =
            statusFilter.value;


        rows.forEach(row => {

            const title =
                row.dataset.title
                    .toLowerCase();

            const rowCategory =
                row.dataset.category;

            const rowStatus =
                row.dataset.status;


            const matchesSearch =
                title.includes(search);

            const matchesCategory =
                !category ||
                rowCategory === category;

            const matchesStatus =
                !status ||
                rowStatus === status;


            const shouldShow =
                matchesSearch &&
                matchesCategory &&
                matchesStatus;


            row.style.display =
                shouldShow ? "" : "none";

        });

    }


    searchInput.addEventListener(
        "input",
        filterSituations
    );


    categoryFilter.addEventListener(
        "change",
        filterSituations
    );


    statusFilter.addEventListener(
        "change",
        filterSituations
    );

});
