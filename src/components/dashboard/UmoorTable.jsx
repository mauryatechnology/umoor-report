'use client';

import { useState } from 'react';
import { Plus, Eye, Pencil, Trash2, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';
import DataTable from '../ui/DataTable';
import ConfirmDialog from '../ui/ConfirmDialog';
import UmoorFormDialog from './UmoorFormDialog';
import UmoorViewDialog from './UmoorViewDialog';

export default function UmoorTable({ data, onChange, language }) {
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const isUrdu = language === 'ur';
  const umoors = data.reportsData || [];

  const handleAdd = () => {
    setEditingIndex(null);
    setFormOpen(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormOpen(true);
  };

  const handleView = (index) => {
    setViewingIndex(index);
    setViewOpen(true);
  };

  const handleDeleteClick = (index) => {
    setDeletingIndex(index);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingIndex === null) return;
    const newReports = [...umoors];
    newReports.splice(deletingIndex, 1);
    onChange({ ...data, reportsData: newReports });
    setDeleteOpen(false);
    setDeletingIndex(null);
  };

  const handleFormSave = (umoorData) => {
    const newReports = [...umoors];
    if (editingIndex !== null) {
      // Edit existing
      newReports[editingIndex] = umoorData;
    } else {
      // Add new
      newReports.push(umoorData);
    }
    onChange({ ...data, reportsData: newReports });
    setFormOpen(false);
    setEditingIndex(null);
  };

  const columns = [
    {
      header: '#',
      width: '50px',
      render: (_, idx) => (
        <span className="text-charcoal/40 font-mono text-xs">{idx + 1}</span>
      ),
    },
    {
      header: 'Umoor Name',
      render: (row) => (
        <div className={isUrdu ? 'font-kanz text-right text-base' : ''}>
          <span className="font-semibold text-charcoal">
            {row.name || <span className="italic text-charcoal/30">Untitled</span>}
          </span>
          {row.accordion?.heading && (
            <p className={`text-xs text-charcoal/45 mt-0.5 truncate max-w-xs ${isUrdu ? 'font-kanz' : ''}`}>
              {row.accordion.heading}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Cities',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-purple-500 shrink-0" />
          <span className="font-semibold text-charcoal/70">{row.cities?.length || 0}</span>
        </div>
      ),
    },
    {
      header: 'Achievements',
      width: '120px',
      render: (row) => {
        const count = (row.cities || []).reduce(
          (sum, c) => sum + (c.achievements?.length || 0),
          0
        );
        return (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span className="font-semibold text-charcoal/70">{count}</span>
          </div>
        );
      },
    },
    {
      header: 'Improvements',
      width: '130px',
      render: (row) => {
        const count = (row.cities || []).reduce(
          (sum, c) => sum + (c.improvements?.length || 0),
          0
        );
        return (
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-amber-500 shrink-0" />
            <span className="font-semibold text-charcoal/70">{count}</span>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      width: '140px',
      cellClassName: 'text-right',
      className: 'text-right',
      render: (_, idx) => (
        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleView(idx)}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEdit(idx)}
            className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(idx)}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Header bar */}
      <div className="flex items-center justify-between px-1 mb-4">
        <div>
          <h3 className="font-bold text-charcoal text-base">
            Umoor List
          </h3>
          <p className="text-xs text-charcoal/50 mt-0.5">
            {umoors.length} umoor{umoors.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-emerald-dark hover:bg-emerald-light text-gold px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm text-sm"
        >
          <Plus size={16} />
          Add Umoor
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={umoors}
        emptyMessage="No umoors added yet. Click 'Add Umoor' to get started."
      />

      {/* Form Dialog (Add/Edit) */}
      <UmoorFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingIndex(null);
        }}
        onSave={handleFormSave}
        initialData={editingIndex !== null ? umoors[editingIndex] : null}
        language={language}
        isEditing={editingIndex !== null}
      />

      {/* View Dialog */}
      {viewingIndex !== null && (
        <UmoorViewDialog
          open={viewOpen}
          onClose={() => {
            setViewOpen(false);
            setViewingIndex(null);
          }}
          umoor={umoors[viewingIndex]}
          language={language}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingIndex(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Umoor"
        message={`Are you sure you want to delete "${
          deletingIndex !== null ? umoors[deletingIndex]?.name || 'Untitled' : ''
        }" and all its cities, achievements, and improvements? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}
