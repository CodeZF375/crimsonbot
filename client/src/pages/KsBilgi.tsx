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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { KsBilgi } from '@shared/schema';

const KsBilgiPage: React.FC = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInfo, setCurrentInfo] = useState<KsBilgi | null>(null);
  const [formData, setFormData] = useState({
    baslik: '',
    bilgi: ''
  });
  
  const { data: ksBilgileri = [], isLoading } = useQuery({
    queryKey: ['/api/ksbilgi'],
  });
  
  const addMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      return apiRequest('POST', '/api/ksbilgi', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ksbilgi'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "KS Bilgisi başarıyla eklendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `KS Bilgisi eklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const editMutation = useMutation({
    mutationFn: (data: { id: number; data: typeof formData }) => {
      return apiRequest('PUT', `/api/ksbilgi/${data.id}`, data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ksbilgi'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Başarılı",
        description: "KS Bilgisi başarıyla güncellendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `KS Bilgisi güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/ksbilgi/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ksbilgi'] });
      setIsDeleteDialogOpen(false);
      setCurrentInfo(null);
      toast({
        title: "Başarılı",
        description: "KS Bilgisi başarıyla silindi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: `KS Bilgisi silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const resetForm = () => {
    setFormData({
      baslik: '',
      bilgi: ''
    });
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInfo) {
      editMutation.mutate({ id: currentInfo.id, data: formData });
    }
  };
  
  const handleDelete = () => {
    if (currentInfo) {
      deleteMutation.mutate(currentInfo.id);
    }
  };
  
  const handleEdit = (info: KsBilgi) => {
    setCurrentInfo(info);
    setFormData({
      baslik: info.baslik,
      bilgi: info.bilgi
    });
    setIsEditDialogOpen(true);
  };
  
  const handleShowDelete = (info: KsBilgi) => {
    setCurrentInfo(info);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-discord-lightest flex items-center">
          <i className="ri-information-line mr-2 text-discord-primary"></i>
          KS Bilgi
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
              title="/ksbilgi ekle"
              description="Yeni klan savaşı bilgisi ekle"
              type="add"
              command="/ksbilgi ekle [başlık] [bilgi]"
              onExecute={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              onHelp={() => {
                toast({
                  title: "Komut Yardımı",
                  description: "/ksbilgi ekle komutu yeni bir klan savaşı bilgisi eklemenizi sağlar. Başlık ve bilgi parametreleri zorunludur.",
                });
              }}
            />
            
            <CommandCard 
              title="/ksbilgi kaldır"
              description="Var olan bir klan savaşı bilgisini kaldır"
              type="remove"
              command="/ksbilgi kaldır [başlık]"
              onExecute={() => {
                toast({
                  title: "Bilgi",
                  description: "Aşağıdaki listeden kaldırmak istediğiniz bilgiyi seçebilirsiniz.",
                });
              }}
              onHelp={() => {
                toast({
                  title: "Komut Yardımı",
                  description: "/ksbilgi kaldır komutu var olan bir klan savaşı bilgisini silmenizi sağlar. Başlık parametresi zorunludur.",
                });
              }}
            />
          </div>
          
          <div className="border-t border-discord-light/10 pt-4">
            <h3 className="text-discord-lightest font-semibold mb-4">KS Bilgileri</h3>
            {isLoading ? (
              <div className="py-4 text-center text-discord-light">Yükleniyor...</div>
            ) : (
              <div className="space-y-4">
                {ksBilgileri.length === 0 ? (
                  <div className="py-4 text-center text-discord-light">
                    Henüz bilgi bulunmuyor
                  </div>
                ) : (
                  ksBilgileri.map((info) => (
                    <div key={info.id} className="bg-discord-dark rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-discord-lightest font-semibold">{info.baslik}</h4>
                          <p className="text-sm text-discord-light mt-2 whitespace-pre-line">{info.bilgi}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(info)}
                            className="p-1 text-discord-light hover:text-discord-lightest h-auto"
                          >
                            <i className="ri-edit-line"></i>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleShowDelete(info)}
                            className="p-1 text-discord-light hover:text-discord-danger h-auto"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </div>
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
            <DialogTitle className="text-discord-lightest">Yeni KS Bilgisi Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baslik">Başlık</Label>
                <Input
                  id="baslik"
                  value={formData.baslik}
                  onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                  placeholder="Örn: Savaş Kuralları"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bilgi">Bilgi</Label>
                <Textarea
                  id="bilgi"
                  value={formData.bilgi}
                  onChange={(e) => setFormData({ ...formData, bilgi: e.target.value })}
                  className="bg-discord-dark border-discord-light/10 min-h-[100px]"
                  required
                  placeholder="Bilgi içeriğini buraya girin"
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
            <DialogTitle className="text-discord-lightest">KS Bilgisini Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-baslik">Başlık</Label>
                <Input
                  id="edit-baslik"
                  value={formData.baslik}
                  onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                  className="bg-discord-dark border-discord-light/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bilgi">Bilgi</Label>
                <Textarea
                  id="edit-bilgi"
                  value={formData.bilgi}
                  onChange={(e) => setFormData({ ...formData, bilgi: e.target.value })}
                  className="bg-discord-dark border-discord-light/10 min-h-[100px]"
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
            <DialogTitle className="text-discord-lightest">KS Bilgisini Sil</DialogTitle>
          </DialogHeader>
          <p>
            <strong>{currentInfo?.baslik}</strong> başlıklı KS bilgisini silmek istediğinize emin misiniz?
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

export default KsBilgiPage;
