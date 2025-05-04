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
import { useToast } from '@/hooks/use-toast';
import { Sunucular } from '@shared/schema';

const SunucularPage: React.FC = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSunucu, setCurrentSunucu] = useState<Sunucular | null>(null);
  const [formData, setFormData] = useState({
    isim: '',
    ip: '',
    port: '',
    bilgi: ''
  });
  
  const { data: sunucular = [], isLoading } = useQuery({
    queryKey: ['/api/sunucular'],
  });
  
  const addMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      return apiRequest('POST', '/api/sunucular', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sunucular'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Sunucu başarıyla eklendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `Sunucu eklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const editMutation = useMutation({
    mutationFn: (data: { id: number; data: typeof formData }) => {
      return apiRequest('PUT', `/api/sunucular/${data.id}`, data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sunucular'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "Sunucu başarıyla güncellendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `Sunucu güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/sunucular/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sunucular'] });
      setIsDeleteDialogOpen(false);
      setCurrentSunucu(null);
      toast({
        title: "Başarılı",
        description: "Sunucu başarıyla silindi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `Sunucu silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const resetForm = () => {
    setFormData({
      isim: '',
      ip: '',
      port: '',
      bilgi: ''
    });
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSunucu) {
      editMutation.mutate({ id: currentSunucu.id, data: formData });
    }
  };
  
  const handleDelete = () => {
    if (currentSunucu) {
      deleteMutation.mutate(currentSunucu.id);
    }
  };
  
  const handleEdit = (sunucu: Sunucular) => {
    setCurrentSunucu(sunucu);
    setFormData({
      isim: sunucu.isim,
      ip: sunucu.ip,
      port: sunucu.port || '',
      bilgi: sunucu.bilgi || ''
    });
    setIsEditDialogOpen(true);
  };
  
  const handleShowDelete = (sunucu: Sunucular) => {
    setCurrentSunucu(sunucu);
    setIsDeleteDialogOpen(true);
  };
  
  const columns = [
    { key: 'isim' as keyof Sunucular, header: 'İsim' },
    { key: 'ip' as keyof Sunucular, header: 'IP Adresi' },
    { key: 'port' as keyof Sunucular, header: 'Port' },
    { key: 'bilgi' as keyof Sunucular, header: 'Bilgi' },
  ];
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-discord-lightest flex items-center">
          <i className="ri-server-line mr-2 text-discord-primary"></i>
          Oynadığımız Sunucular
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
              title="/sunucular ekle"
              description="Yeni sunucu bilgisi ekle"
              type="add"
              command="/sunucular ekle [isim] [ip] [port] [bilgi]"
              onExecute={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              onHelp={() => {
                toast({
                  title: "Komut Yardımı",
                  description: "/sunucular ekle komutu yeni bir sunucu eklemenizi sağlar. İsim ve IP parametreleri zorunludur.",
                });
              }}
            />
            
            <CommandCard 
              title="/sunucular kaldır"
              description="Var olan bir sunucuyu kaldır"
              type="remove"
              command="/sunucular kaldır [isim]"
              onExecute={() => {
                toast({
                  title: "Bilgi",
                  description: "Tablodan kaldırmak istediğiniz sunucuyu seçebilirsiniz.",
                });
              }}
              onHelp={() => {
                toast({
                  title: "Komut Yardımı",
                  description: "/sunucular kaldır komutu var olan bir sunucuyu silmenizi sağlar. İsim parametresi zorunludur.",
                });
              }}
            />
          </div>
          
          <div className="border-t border-discord-light/10 pt-4">
            <h3 className="text-discord-lightest font-semibold mb-4">Mevcut Sunucular</h3>
            {isLoading ? (
              <div className="py-4 text-center text-discord-light">Yükleniyor...</div>
            ) : (
              <CommandTable 
                data={sunucular}
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
            <DialogTitle className="text-discord-lightest">Yeni Sunucu Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="isim">Sunucu İsmi</Label>
                <Input
                  id="isim"
                  value={formData.isim}
                  onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                  placeholder="Örn: TurkMMO"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">IP Adresi</Label>
                <Input
                  id="ip"
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                  placeholder="Örn: play.server.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port (İsteğe bağlı)</Label>
                <Input
                  id="port"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  placeholder="Örn: 25565"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bilgi">Bilgi (İsteğe bağlı)</Label>
                <Input
                  id="bilgi"
                  value={formData.bilgi}
                  onChange={(e) => setFormData({ ...formData, bilgi: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  placeholder="Örn: Ana sunucumuz"
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
            <DialogTitle className="text-discord-lightest">Sunucu Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-isim">Sunucu İsmi</Label>
                <Input
                  id="edit-isim"
                  value={formData.isim}
                  onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ip">IP Adresi</Label>
                <Input
                  id="edit-ip"
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-port">Port</Label>
                <Input
                  id="edit-port"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                />
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
            <DialogTitle className="text-discord-lightest">Sunucu Sil</DialogTitle>
          </DialogHeader>
          <p>
            <strong>{currentSunucu?.isim}</strong> isimli sunucuyu silmek istediğinize emin misiniz?
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

export default SunucularPage;
