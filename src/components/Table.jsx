import React, { useState } from 'react';
import { IoMdCheckmark } from "react-icons/io";
import { TbChevronDown, TbChevronUp } from "react-icons/tb";
import paginationDotItems from '../utils/pagination';

const Table = ({ columns, userData }) => {
    const [filteredColumns, setFilteredColumns] = useState(columns);
    const [data, setData] = useState(userData);
    const [editing, setEditing] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [sortBy, setSortBy] = useState({});
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const filteredData = data.filter(row => row.name.toLowerCase().includes(searchInput.toLowerCase()));
    

    const handleEdit = (rowId, columnId, value) => {
        const newData = data.map(row => row.id === rowId ? { ...row, [columnId]: value } : row);
        setData(newData);
    };

    const editMode = (rowId, columnId) => {
        setEditing(prev => ({
            ...prev,
            [`${rowId}-${columnId}`]: !prev[`${rowId}-${columnId}`]
        }));
    };

    const updateColumnFilters = (column) => {
        setFilteredColumns(prev => {
            const isChecked = prev.some(col => col.id === column.id);
            const updatedColumns = isChecked
                ? prev.filter(col => col.id !== column.id)
                : [...prev, column].sort((a, b) => a.ordinalNo - b.ordinalNo);
            return updatedColumns;
        });
    };

    const handleSort = (columnId) => {
        let direction = 'ascending';

        if (sortBy && sortBy.column === columnId && sortBy.direction === 'ascending') {
            direction = 'descending';
        }
        setSortBy({ column: columnId, direction: direction });
        const postSort = [...data].sort((a, b) => {
            let A = a[columnId];
            let B = b[columnId];

            if (columnId.type === 'number' || columnId.type === 'float') {
                A = parseFloat(A);
                B = parseFloat(B);
            }
            if (A < B) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (A > B) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        }
        );

        setData(postSort);
    };

    const displayCell = (row, column) => {
        const key = `${row.id}-${column.id}`;
        const isEditing = editing[key];

        if (column.type === 'boolean') {
            return (
                <input
                    type="checkbox"
                    className='table-checkbox'
                    checked={row[column.id]}
                    onChange={(e) => handleEdit(row.id, column.id, e.target.checked)}
                />
            );
        }

        if (isEditing) {
            if (column.type === 'selection') {
                return (
                    <div className='cell'>
                        <select
                            className="select-list"
                            value={row[column.id]}
                            onChange={(e) => handleEdit(row.id, column.id, e.target.value)}
                        >
                            {column.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <button className='checkmarkicon' onClick={() => editMode(row.id, column.id)}>
                            <IoMdCheckmark />
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className='cell'>
                        <input
                            type='text'
                            className="table-edit"
                            value={row[column.id]}
                            onChange={(e) => handleEdit(row.id, column.id, e.target.value)}
                        />
                        <button className='checkmarkicon' onClick={() => editMode(row.id, column.id)}>
                            <IoMdCheckmark />
                        </button>
                    </div>
                );
            }
        } else {
            const cellValue = column.type === 'float' ? '$' + (row[column.id]) : row[column.id]; return (
                <>
                    <span onClick={() => editMode(row.id, column.id)}>{cellValue}</span>
                </>
            );
        }
    };

    const rowsPerPage = 15;
    const lastRowIndex = currentPage * rowsPerPage;
    const firstRowIndex = lastRowIndex - rowsPerPage;
    const slicedRows = filteredData.slice(firstRowIndex, lastRowIndex);
    const pageCount = Math.ceil(filteredData.length / rowsPerPage)

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const pageNumbers = [];
    for (let i = 1; i <= pageCount; i++) {
        pageNumbers.push(i);
    }

    const renderPagination = (pageNumbers) => {
        const paginationList = paginationDotItems(currentPage, pageCount);
        return paginationList.map(item => {
            if (item === "...") {
                return <li className="pagination-item" key={item}>...</li>;
            } else {
                return (
                    <li key={item} className="pagination-item">
                        <a href="/#" onClick={(e) => { e.preventDefault(); paginate(item); }}
                            className={`pagination-link ${currentPage === item ? 'active' : ''}`}>
                            {item}
                        </a>
                    </li>
                );
            }
        });
    };

    return (
        <div className='content'>
            <div className='filter-div'>
                <input
                    type="text"
                    placeholder="Sam Anto..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="search-bar"
                />
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="toggle-menu-btn">
                    {isMenuOpen ? (<><span>Hide Columns</span> <TbChevronUp /></>) : (<>Show Columns <TbChevronDown /></>)}
                </button>
            </div>
                {isMenuOpen && (
                    <div className="column-menu">
                        {columns.map((column) => (
                            <label key={column.id} className="column-label">
                                <input
                                    type="checkbox"
                                    checked={filteredColumns.find((col) => col.id === column.id) !== undefined}
                                    onChange={() => updateColumnFilters(column)}
                                    className="custom-checkbox"
                                />
                                <span className="column-label-text">{column.title}</span>
                            </label>
                        ))}
                    </div>
                )}
            <table>
                <thead>
                    <tr>
                        {filteredColumns.map(column => (
                            <th key={column.id} style={{ width: column.width || 'auto' }} onClick={() => handleSort(column.id)}>
                                <div className="header-content">
                                    {column.title}
                                    {sortBy && sortBy.column === column.id && (
                                        sortBy.direction === 'ascending' ? <TbChevronUp /> : <TbChevronDown />
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {slicedRows.map(row => (
                        <tr key={row.id}>
                            {filteredColumns.map(column => (
                                <td key={column.id} style={{ width: column.width || 'auto' }}>
                                    {displayCell(row, column)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <ul className="pagination">
                <li className="pagination-item">
                    <a href="/#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) paginate(currentPage - 1); }} className="pagination-link">
                        {'<'}
                    </a>
                </li>
                {renderPagination(pageNumbers)}
                <li className="pagination-item">
                    <a href="/#" onClick={(e) => { e.preventDefault(); if (currentPage < pageCount) paginate(currentPage + 1); }} className="pagination-link">
                        {'>'}
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Table;
