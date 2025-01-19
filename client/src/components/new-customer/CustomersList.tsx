import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CustomersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [clients, setClients] = useState([
    { id: 1, value: 'Value 1' },
    { id: 2, value: 'Value 2' },
    { id: 3, value: 'Value 3' },
    { id: 4, value: 'Value 4' },
    { id: 5, value: 'Value 5' },
    { id: 6, value: 'Value 6' },
    { id: 7, value: 'Value 7' },
    { id: 8, value: 'Value 8' },
  ]);
  const [filteredClients, setFilteredClients] = useState(clients);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { t } = useTranslation();

  const navigate = useNavigate();

  // Debouncing the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter clients whenever the debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setFilteredClients(clients);
    } else {
      setFilteredClients(
        clients.filter(client =>
          client.value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      );
    }
    setCurrentPage(1); // Reset to the first page when the search term changes
  }, [debouncedSearchTerm, clients]);

  const handleSearchClick = () => {
    setFilteredClients(
      clients.filter(client =>
        client.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleAddClient = () => {
    navigate('/customer/add-new');
  };

  const handleAddInspection = (id:number) => {
    navigate(`/add-inspection/${id}`);
  };

  // Pagination controls
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const displayedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4 flex justify-center">
      <div className="w-3/4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{t('searchClient')}</h1>
          <button
            onClick={handleAddClient}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {t('addNewCustomer')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center mb-4 border border-gray-300 rounded">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 focus:outline-none"
          />
          <button
            onClick={handleSearchClick}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
          >
            🔍
          </button>
        </div>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedClients.map((client) => (
              <tr key={client.id}>
                <td className="border border-gray-300 px-4 py-2">{client.id}</td>
                <td className="border border-gray-300 px-4 py-2">{client.value}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleAddInspection(client.id)}
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 flex items-center gap-1"
                    >
                      <i className="fas fa-plus"></i> {t('addNewInspection')}
                    </button>
                    <button
                      className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                    >
                      Dummy Button
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <label className="mr-2">{t('recordsPerPage')}</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-2"
              disabled={currentPage === 1}
            >
              {t('back')}
            </button>
            <span>{t('pageCounterForTables', {
                currentPage, totalPages
            })}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ml-2"
              disabled={currentPage === totalPages}
            >
              {t('next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersList;
