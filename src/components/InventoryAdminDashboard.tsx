import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InventoryItem {
  id?: string;
  name: string;
  status: string;
  [key: string]: any;
}

export default function InventoryAdminDashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', status: 'active' });
  const [editing, setEditing] = useState<InventoryItem | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      setItems(data.items);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error('Failed to create');
      setNewItem({ name: '', status: 'active' });
      fetchItems();
    } catch {}
  };

  const handleUpdate = async (item: InventoryItem) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed to update');
      setEditing(null);
      fetchItems();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchItems();
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Admin</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Name"
          value={newItem.name}
          onChange={e => setNewItem({ ...newItem, name: e.target.value })}
        />
        <Button onClick={handleCreate} disabled={!newItem.name}>Add</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td className="p-2">
                  {editing && editing.id === item.id ? (
                    <Input value={editing.name} onChange={e => editing && setEditing({ ...editing, name: e.target.value })} />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="p-2">
                  {editing && editing.id === item.id ? (
                    <Input value={editing.status} onChange={e => editing && setEditing({ ...editing, status: e.target.value })} />
                  ) : (
                    item.status
                  )}
                </td>
                <td className="p-2 flex gap-2">
                  {editing && editing.id === item.id ? (
                    <>
                      <Button size="sm" onClick={() => editing && handleUpdate(editing)}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => setEditing(item)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id!)}>Delete</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
