import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // ➕ CREATE
  async create(data: Partial<User>): Promise<User> {

    const newUser = new this.userModel(data);
    return newUser.save();
  }

  // 👁️ READ (tous les utilisateurs)
  async findAll(): Promise<User[]> {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  // 👁️ READ (un seul utilisateur)
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  // ✏️ UPDATE
// ✏️ UPDATE
async update(id: string, data: Partial<User>): Promise<User> {
  // Si le phone change, vérifier qu’il n’appartient pas à un autre user
  if (data.phone) {
    const duplicate = await this.userModel.findOne({ phone: data.phone, _id: { $ne: id } });
    if (duplicate) {
      throw new BadRequestException('Ce numéro est déjà utilisé par un autre utilisateur.');
    }
  }

  // ⚙️ Si la dateFin est passée → statut devient "non payé"
  if (data.dateFin) {
    const now = new Date();
    const dateFin = new Date(data.dateFin);

    if (dateFin < now) {
      data.statut = 'non payé';
    }
  }

  const updated = await this.userModel.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new NotFoundException('Utilisateur introuvable');

  return updated;
}

  // ❌ DELETE
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Utilisateur introuvable');
    return { message: 'Utilisateur supprimé avec succès' };
  }

  // ✅ Nouvelle méthode : met à jour les statuts expirés
   async updateExpiredUsers(): Promise<void> {
    const now = new Date();

    // Tous les utilisateurs dont la dateFin est passée ET statut = payé ou en cours
    await this.userModel.updateMany(
      {
        statut: { $in: ['payé', 'en cours'] },
        dateFin: { $lt: now },
      },
      {
        $set: { statut: 'non payé' },
      },
    );
  }

  
async getDashboardStats() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const users = await this.userModel.find().exec();

  const total = users.length;
  const payes = users.filter((u) => u.statut === 'payé').length;
  const nonPayes = users.filter((u) => u.statut === 'non payé').length;
  const enCours = users.filter((u) => u.statut === 'en cours').length;

  const moisLabels = [
    "Janv", "Févr", "Mars", "Avr", "Mai", "Juin",
    "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
  ];
  const inscritsParMois = Array(12).fill(0);

  for (const u of users) {
    if (u.createdAt) {
      const created = new Date(u.createdAt);
      if (created >= startOfYear && created.getFullYear() === now.getFullYear()) {
        inscritsParMois[created.getMonth()]++;
      }
    }
  }

  return {
    total,
    payes,
    nonPayes,
    enCours,
    labels: moisLabels,
    inscritsParMois,
  };
}

}
