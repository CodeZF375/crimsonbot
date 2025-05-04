import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CommandCard from '@/components/CommandCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AsKadro } from '@shared/schema';

const AsKadroPage: React.FC = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<AsKadro | null>(null);
  const [formData, setFormData] = useState({
    isim: '',
    rol: '',
    girisTarihi: ''
  });
  
  const { data: kadroUyeleri = [], isLoading } = useQuery({
    queryKey: ['/api/askadro'],
  });
  
  const addMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      return apiRequest('POST', '/api/askadro', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/askadro'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "AS Kadro üyesi başarıyla eklendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `AS Kadro üyesi eklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const editMutation = useMutation({
    mutationFn: (data: { id: number; data: typeof formData }) => {
      return apiRequest('PUT', `/api/askadro/${data.id}`, data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/askadro'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "AS Kadro üyesi başarıyla güncellendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `AS Kadro üyesi güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/askadro/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/askadro'] });
      setIsDeleteDialogOpen(false);
      setCurrentMember(null);
      toast({
        title: "Başarılı",
        description: "AS Kadro üyesi başarıyla silindi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `AS Kadro üyesi silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const resetForm = () => {
    setFormData({
      isim: '',
      rol: '',
      girisTarihi: ''
    });
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMember) {
      editMutation.mutate({ id: currentMember.id, data: formData });
    }
  };
  
  const handleDelete = () => {
    if (currentMember) {
      deleteMutation.mutate(currentMember.id);
    }
  };
  
  const handleEdit = (member: AsKadro) => {
    setCurrentMember(member);
    setFormData({
      isim: member.isim,
      rol: member.rol,
      girisTarihi: member.girisTarihi
    });
    setIsEditDialogOpen(true);
  };
  
  const handleShowDelete = (member: AsKadro) => {
    setCurrentMember(member);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-discord-lightest flex items-center">
          <i className="ri-group-line mr-2 text-discord-primary"></i>
          AS Kadro
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
              title="/askadro ekle"
              description="AS Kadrosuna yeni üye ekle"
              type="add"
              command="/askadro ekle [isim] [rol] [giriş_tarihi]"
              onExecute={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              onHelp={() => {
                toast({
                  title: "Komut Yardımı",
                  description: "/askadro ekle komutu AS kadrosuna yeni bir üye eklemenizi sağlar. İsim, rol ve giriş tarihi zorunlu parametrelerdir.",
                });
              }}
            />
            
            <CommandCard 
              title="/askadro kaldır"
              description="AS Kadrosundan üye kaldır"
              type="remove"
              command="/askadro kaldır [isim]"
              onExecute={() => {
                toast({
                  title: "Bilgi",
                  description: "Kaldırmak istediğiniz üyeyi aşağıdaki listeden seçebilirsiniz.",
                });
              }}
              onHelp={() => {
                toast({
                  title: "Komut Yardımı",
                  description: "/askadro kaldır komutu AS kadrosundan bir üyeyi silmenizi sağlar. İsim parametresi zorunludur.",
                });
              }}
            />
          </div>
          
          <div className="border-t border-discord-light/10 pt-4">
            <h3 className="text-discord-lightest font-semibold mb-4">AS Kadro Üyeleri</h3>
            {isLoading ? (
              <div className="py-4 text-center text-discord-light">Yükleniyor...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kadroUyeleri.length === 0 ? (
                  <div className="col-span-full py-4 text-center text-discord-light">
                    Henüz üye bulunmuyor
                  </div>
                ) : (
                  kadroUyeleri.map((member) => (
                    <div key={member.id} className="bg-discord-dark rounded-md p-4 flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-discord-primary/20 flex items-center justify-center text-discord-primary flex-shrink-0">
                        <i className="ri-user-line"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-discord-lightest font-medium">{member.isim}</h4>
                        <p className="text-sm text-discord-light">{member.rol}</p>
                        <p className="text-xs text-discord-light/70 mt-1">Giriş: {member.girisTarihi}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(member)}
                          className="p-1 text-discord-light hover:text-discord-lightest h-auto"
                        >
                          <i className="ri-edit-line"></i>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShowDelete(member)}
                          className="p-1 text-discord-light hover:text-discord-danger h-auto"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-discord-darker text-discord-light border-discord-light/10">
          <DialogHeader>
            <DialogTitle className="text-discord-lightest">AS Kadrosuna Üye Ekle</DialogTitle>
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
                <Label htmlFor="rol">Rol</Label>
                <Input
                  id="rol"
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                  placeholder="Örn: Lider, Savaşçı, Yardımcı"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="girisTarihi">Giriş Tarihi</Label>
                <Input
                  id="girisTarihi"
                  value={formData.girisTarihi}
                  onChange={(e) => setFormData({ ...formData, girisTarihi: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                  placeholder="gg.aa.yyyy (Örn: 12.05.2022)"
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
            <DialogTitle className="text-discord-lightest">AS Kadro Üyesini Düzenle</DialogTitle>
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
                <Label htmlFor="edit-rol">Rol</Label>
                <Input
                  id="edit-rol"
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-girisTarihi">Giriş Tarihi</Label>
                <Input
                  id="edit-girisTarihi"
                  value={formData.girisTarihi}
                  onChange={(e) => setFormData({ ...formData, girisTarihi: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
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
            <DialogTitle className="text-discord-lightest">AS Kadro Üyesini Sil</DialogTitle>
          </DialogHeader>
          <p>
            <strong>{currentMember?.isim}</strong> isimli üyeyi AS kadrosundan silmek istediğinize emin misiniz?
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

export default AsKadroPage;
