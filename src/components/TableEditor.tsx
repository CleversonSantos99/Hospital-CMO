import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { CreditCard as Edit2, Save, X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

type TableEditorProps = {
  tableName: 'especialidade' | 'procedimentos';
  columns: Array<{
    key: string;
    label: string;
    type: 'text' | 'date' | 'datetime' | 'select';
    options?: string[];
    required?: boolean;
  }>;
};

export default function TableEditor({ tableName, columns }: TableEditorProps) {
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newRow, setNewRow] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
    fetchData(0);
  }, [tableName, pageSize]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      let result;
      if (tableName === 'especialidade') {
        result = await apiClient.getEspecialidades();
      } else {
        result = await apiClient.getProcedimentos();
      }

      const from = page * pageSize;
      const to = from + pageSize;
      const paginatedData = result.slice(from, to);

      setData(paginatedData || []);
      setTotalCount(result.length || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleEdit = (row: any) => {
    setEditingRow({ ...row });
  };

  const handleCancel = () => {
    setEditingRow(null);
    setIsAdding(false);
    setNewRow({});
  };

  const handleSave = async () => {
    if (!editingRow) return;

    const id = editingRow.id;
    const updateData = { ...editingRow };
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    try {
      if (tableName === 'especialidade') {
        await apiClient.updateEspecialidade(id, updateData);
      } else {
        await apiClient.updateProcedimento(id, updateData);
      }
      setEditingRow(null);
      fetchData(currentPage);
    } catch (error) {
      alert('Erro ao salvar: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;

    try {
      if (tableName === 'especialidade') {
        await apiClient.deleteEspecialidade(id as number);
      } else {
        await apiClient.deleteProcedimento(id as number);
      }
      fetchData(currentPage);
    } catch (error) {
      alert('Erro ao excluir: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleModalChange = (key: string, value: any) => {
    if (isAdding) {
      setNewRow({ ...newRow, [key]: value });
    } else {
      setEditingRow({ ...editingRow, [key]: value });
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setNewRow({});
  };

  const handleSaveNew = async () => {
    try {
      if (tableName === 'especialidade') {
        await apiClient.createEspecialidade(newRow);
      } else {
        await apiClient.createProcedimento(newRow);
      }
      setIsAdding(false);
      setNewRow({});
      fetchData(currentPage);
    } catch (error) {
      alert('Erro ao adicionar: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const renderModalField = (column: any) => {
    const value = isAdding ? newRow[column.key] : editingRow?.[column.key];

    if (column.key === 'id') {
      return (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
          {isAdding ? 'Gerado automaticamente' : (value || 'N/A')}
        </div>
      );
    }

    if (column.type === 'select') {
      return (
        <select
          value={value || ''}
          onChange={(e) => handleModalChange(column.key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
        >
          <option value="">Selecione...</option>
          {column.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <textarea
        value={value || ''}
        onChange={(e) => handleModalChange(column.key, e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
        placeholder={isAdding ? `Digite ${column.label.toLowerCase()}...` : ''}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Linhas por página:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <span className="text-sm text-gray-500 text-center sm:text-left">Total: {totalCount} registros</span>
          <button
            onClick={handleAdd}
            disabled={editingRow !== null || isAdding}
            className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </div>

      {/* Layout de Cards para Mobile */}
      <div className="block lg:hidden space-y-4">
        {data.map((row) => (
          <div key={row.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            {columns.map((col) => {
              if (col.key === 'id') return null;
              let value = row[col.key];
              if (col.type === 'date' && value) {
                value = new Date(value).toLocaleDateString('pt-BR');
              } else if (col.type === 'datetime' && value) {
                value = new Date(value).toLocaleString('pt-BR');
              }
              return (
                <div key={col.key} className="mb-3 last:mb-0">
                  <dt className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    {col.label}
                  </dt>
                  <dd className="text-sm text-gray-900 break-words">
                    {value || '-'}
                  </dd>
                </div>
              );
            })}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEdit(row)}
                disabled={editingRow !== null}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                disabled={editingRow !== null}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Layout de Tabela para Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-gray-50">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                {columns.map((col) => {
                  let value = row[col.key];
                  if (col.type === 'date' && value) {
                    value = new Date(value).toLocaleDateString('pt-BR');
                  } else if (col.type === 'datetime' && value) {
                    value = new Date(value).toLocaleString('pt-BR');
                  }
                  return (
                    <td key={col.key} className="px-3 py-3 text-sm text-gray-700">
                      <div className="max-w-xs break-words line-clamp-3">
                        {value || '-'}
                      </div>
                    </td>
                  );
                })}
                <td className="px-3 py-3 sticky right-0 bg-white">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      disabled={editingRow !== null}
                      className="text-blue-600 hover:text-blue-700 p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      disabled={editingRow !== null}
                      className="text-red-600 hover:text-red-700 p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum registro encontrado
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-600 text-center sm:text-left">
          Página {currentPage + 1} de {totalPages}
        </div>
        <div className="flex gap-2 justify-center sm:justify-end">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Próxima
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {(editingRow || isAdding) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {isAdding ? 'Adicionar Novo Registro' : 'Editar Registro'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {columns.map((col) => (
                <div key={col.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {col.label}
                    {col.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderModalField(col)}
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={isAdding ? handleSaveNew : handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition"
              >
                <Save className="w-4 h-4" />
                {isAdding ? 'Adicionar' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}