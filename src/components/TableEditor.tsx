import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

type TableEditorProps = {
  tableName: 'patients' | 'appointments' | 'especialidade' | 'procedimentos';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedRow, setEditedRow] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newRow, setNewRow] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const fetchData = async () => {
    setLoading(true);
    let query = supabase.from(tableName).select('*');

    if (tableName === 'patients' || tableName === 'appointments') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('id', { ascending: false });
    }

    const { data: result, error } = await query;

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(result || []);
    }
    setLoading(false);
  };

  const handleEdit = (row: any) => {
    setEditingId(row.id);
    setEditedRow({ ...row });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedRow({});
    setIsAdding(false);
    setNewRow({});
  };

  const handleSave = async () => {
    const updateData = tableName === 'patients' || tableName === 'appointments'
      ? { ...editedRow, updated_at: new Date().toISOString() }
      : { ...editedRow };

    const { error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', editingId);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      setEditingId(null);
      setEditedRow({});
      fetchData();
    }
  };

  const handleAdd = async () => {
    const { error } = await supabase
      .from(tableName)
      .insert([newRow]);

    if (error) {
      alert('Erro ao adicionar: ' + error.message);
    } else {
      setIsAdding(false);
      setNewRow({});
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      alert('Erro ao excluir: ' + error.message);
    } else {
      fetchData();
    }
  };

  const handleChange = (key: string, value: any, isNew = false) => {
    if (isNew) {
      setNewRow({ ...newRow, [key]: value });
    } else {
      setEditedRow({ ...editedRow, [key]: value });
    }
  };

  const renderCell = (row: any, column: any) => {
    const isEditing = editingId === row.id;
    const value = isEditing ? editedRow[column.key] : row[column.key];

    if (column.key === 'id' || column.key === 'created_at' || column.key === 'updated_at') {
      return <span className="text-gray-500 text-sm">{value}</span>;
    }

    if (!isEditing) {
      if (column.type === 'date' && value) {
        return new Date(value).toLocaleDateString('pt-BR');
      }
      if (column.type === 'datetime' && value) {
        return new Date(value).toLocaleString('pt-BR');
      }
      return value || '-';
    }

    if (column.type === 'select') {
      return (
        <select
          value={value || ''}
          onChange={(e) => handleChange(column.key, e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
        >
          {column.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={column.type}
        value={value || ''}
        onChange={(e) => handleChange(column.key, e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
      />
    );
  };

  const renderNewRowCell = (column: any) => {
    if (column.key === 'id' || column.key === 'created_at' || column.key === 'updated_at') {
      return <span className="text-gray-400 text-sm">Auto</span>;
    }

    if (column.type === 'select') {
      return (
        <select
          value={newRow[column.key] || ''}
          onChange={(e) => handleChange(column.key, e.target.value, true)}
          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          required={column.required}
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
      <input
        type={column.type}
        value={newRow[column.key] || ''}
        onChange={(e) => handleChange(column.key, e.target.value, true)}
        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
        required={column.required}
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
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsAdding(true)}
          disabled={isAdding || editingId !== null}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {isAdding && (
            <tr className="border-b border-gray-200 bg-teal-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {renderNewRowCell(col)}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleAdd}
                    className="text-green-600 hover:text-green-700 p-1 transition"
                    title="Salvar"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-gray-600 hover:text-gray-700 p-1 transition"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr
              key={row.id}
              className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                editingId === row.id ? 'bg-blue-50' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {renderCell(row, col)}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                {editingId === row.id ? (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleSave}
                      className="text-green-600 hover:text-green-700 p-1 transition"
                      title="Salvar"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-700 p-1 transition"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      disabled={editingId !== null || isAdding}
                      className="text-blue-600 hover:text-blue-700 p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      disabled={editingId !== null || isAdding}
                      className="text-red-600 hover:text-red-700 p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && !isAdding && (
        <div className="text-center py-12 text-gray-500">
          Nenhum registro encontrado
        </div>
      )}
    </div>
  );
}
