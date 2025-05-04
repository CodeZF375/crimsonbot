import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CommandCard from '@/components/CommandCard';
import CommandTable from '@/components/CommandTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Muteffikler } from '@shared/schema';

const MuteffiklerPage: React.FC = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMuttefik, setCurrentMuttefik] = useState<Muteffikler | null>(null);
  const [formData, setFormData] = useState({
    isim: '',
    tur: 'Klan',
    bilgi: ''
  });
  
  const { data: muteffikler = [], isLoading } = useQuery({
    queryKey: ['/api/muteffikler'],
  });
  
  const addMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      return apiRequest('POST', '/api/muteffikler', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/muteffikler'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Müttefik başarıyla eklendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `Müttefik eklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const editMutation = useMutation({
    mutationFn: (data: { id: number; data: typeof formData }) => {
      return apiRequest('PUT', `/api/muteffikler/${data.id}`, data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/muteffikler'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Müttefik başarıyla güncellendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `Müttefik güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/muteffikler/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/muteffikler'] });
      setIsDeleteDialogOpen(false);
      setCurrentMuttefik(null);
      toast({
        title: "Başarılı",
        description: "Müttefik başarıyla silindi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `Müttefik silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const resetForm = () => {
    setFormData({
      isim: '',
      tur: 'Klan',
      bilgi: ''
    });
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMuttefik) {
      editMutation.mutate({ id: currentMuttefik.id, data: formData });
    }
  };
  
  const handleDelete = () => {
    if (currentMuttefik) {
      deleteMutation.mutate(currentMuttefik.id);
    }
  };
  
  const handleEdit = (muttefik: Muteffikler) => {
    setCurrentMuttefik(muttefik);
    setFormData({
      isim: muttefik.isim,
      tur: muttefik.tur,
      bilgi: muttefik.bilgi || ''
    });
    setIsEditDialogOpen(true);
  };
  
  const handleShowDelete = (muttefik: Muteffikler) => {
    setCurrentMuttefik(muttefik);
    setIsDeleteDialogOpen(true);
  };
  
  const columns = [
    { key: 'isim' as keyof Muteffikler, header: 'İsim' },
    { key: 'tur' as keyof Muteffikler, header: 'Tür' },
    { key: 'bilgi' as keyof Muteffikler, header: 'Bilgi' },
  ];
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-discord-lightest flex items-center">
          <i className="ri-team-line mr-2 text-discord-primary"></i>
          Müttefikler
        </h2>
        <Button 
          className="px-3 py-1.5 bg-discord-primary rounded-md text-sm hover:bg-discord-primary/90 transition text-white h-auto"
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
        >
          <i className="ri-add-line mr-1"></i> Yeni Ekle
        </Button>
      </div>
      
      <Card className="bg-discord-darker rounded-lg border-none">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <CommandCard 
              title="/müttefikler ekle"
              description="Yeni bir müttefik klan veya oyuncu ekle"
              type="add"
              command="/müttefikler ekle [isim] [tür] [bilgi]"
              onExecute={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              onHelp={() => {
                toast({
                  title: "Komut Yardımı",
                  description: "/müttefikler ekle komutu yeni bir müttefik eklemenizi sağlar. İsim ve tür zorunlu parametrelerdir.",
                });
              }}
            />
            
            <CommandCard 
              title="/müttefikler kaldır"
              description="Var olan bir müttefiği kaldır"
              type="remove"
              command="/müttefikler kaldır [isim]"
              onExecute={() => {
                toast({
                  title: "Bilgi",
                  description: "Tablodan kaldırmak istediğiniz müttefiği seçebilirsiniz.",
                });
              }}
              onHelp={() => {
                toast({
                  title: "Komut Yardımı",
                  description: "/müttefikler kaldır komutu var olan bir müttefiği silmenizi sağlar. İsim parametresi zorunludur.",
                });
              }}
            />
          </div>
          
          <div className="border-t border-discord-light/10 pt-4">
            <h3 className="text-discord-lightest font-semibold mb-4">Mevcut Müttefikler</h3>
            {isLoading ? (
              <div className="py-4 text-center text-discord-light">Yükleniyor...</div>
            ) : (
              <CommandTable 
                data={muteffikler}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleShowDelete}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-discord-darker text-discord-light border-discord-light/10">
          <DialogHeader>
            <DialogTitle className="text-discord-lightest">Yeni Müttefik Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="isim">İsim</Label>
                <Input
                  id="isim"
                  value={formData.isim}
                  onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tur">Tür</Label>
                <Select
                  value={formData.tur}
                  onValueChange={(value) => setFormData({ ...formData, tur: value })}
                >
                  <SelectTrigger className="bg-discord-dark border-discord-light/10">
                    <SelectValue placeholder="Tür seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-discord-dark border-discord-light/10">
                    <SelectItem value="Klan">Klan</SelectItem>
                    <SelectItem value="Oyuncu">Oyuncu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bilgi">Bilgi</Label>
                <Input
                  id="bilgi"
                  value={formData.bilgi}
                  onChange={(e) => setFormData({ ...formData, bilgi: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit" className="bg-discord-primary text-white hover:bg-discord-primary/90">
                Ekle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-discord-darker text-discord-light border-discord-light/10">
          <DialogHeader>
            <DialogTitle className="text-discord-lightest">Müttefik Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-isim">İsim</Label>
                <Input
                  id="edit-isim"
                  value={formData.isim}
                  onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tur">Tür</Label>
                <Select
                  value={formData.tur}
                  onValueChange={(value) => setFormData({ ...formData, tur: value })}
                >
                  <SelectTrigger className="bg-discord-dark border-discord-light/10">
                    <SelectValue placeholder="Tür seçin" />
                  </SelectTrigger>
                  <SelectContent className="bg-discord-dark border-discord-light/10">
                    <SelectItem value="Klan">Klan</SelectItem>
                    <SelectItem value="Oyuncu">Oyuncu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bilgi">Bilgi</Label>
                <Input
                  id="edit-bilgi"
                  value={formData.bilgi}
                  onChange={(e) => setFormData({ ...formData, bilgi: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit" className="bg-discord-primary text-white hover:bg-discord-primary/90">
                Güncelle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-discord-darker text-discord-light border-discord-light/10">
          <DialogHeader>
            <DialogTitle className="text-discord-lightest">Müttefik Sil</DialogTitle>
          </DialogHeader>
          <p>
            <strong>{currentMuttefik?.isim}</strong> isimli müttefiği silmek istediğinize emin misiniz?
            Bu işlem geri alınamaz.
          </p>
          <DialogFooter className="mt-4">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              İptal
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              className="bg-discord-danger text-white hover:bg-discord-danger/90"
              onClick={handleDelete}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MuteffiklerPage;
