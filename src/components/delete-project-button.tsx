'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteProject } from '@/app/actions/project';

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error('Failed to delete:', error);
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 justify-start"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Delete Project
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500">
                <div className="p-2 bg-red-500/10 rounded-full border border-red-500/20">
                    <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Delete Project?</h3>
            </div>
            
            <p className="text-zinc-400 text-sm leading-relaxed">
              Are you sure you want to delete this project? This action cannot be undone and will remove all generated data.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button 
                variant="ghost" 
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
                ) : (
                    "Confirm Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}