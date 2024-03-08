"use strict";

class TableTemplate {
    static fillIn(tableId, dict, columnName) {
        const table = document.getElementById(tableId);
        let columnIndex = -1;

        const processRow = (row, isHeader) => {
            Array.from(row.children).forEach((cell, index) => {
                let text = cell.textContent.trim();
                if (isHeader || !columnName || index === columnIndex) {
                    text = text.replace(/{{\s*([^}]+)\s*}}/g, (match, p1) => dict[p1] || '');
                }
                cell.textContent = text;
            });
        };

        const headerRow = table.rows[0];
        processRow(headerRow, true);
        columnIndex = columnName ? 
            Array.from(headerRow.cells).findIndex(
                cell => cell.textContent.trim() === columnName) : -1;

        for (let i = 1; i < table.rows.length; i++) {
            processRow(table.rows[i]);
        }

        table.style.visibility = 'visible';
    }
}