import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, CreationOptional, DataTypes, ForeignKey, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import { ListItem } from './listItem';
import { ListMember } from './listMember';
import { User } from "./user";

export class List extends Model<InferAttributes<List>, InferCreationAttributes<List>> {
    declare public id: CreationOptional<number>;
    declare public name: string;
    declare public creatorId: CreationOptional<ForeignKey<User["id"]>>;
    declare public joinCode: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare creator?: NonAttribute<ListMember>;

    declare getCreator: BelongsToGetAssociationMixin<User>;
    declare setCreator: BelongsToSetAssociationMixin<User, User["id"]>;

    declare getItems: HasManyGetAssociationsMixin<ListItem>;
    declare addItem: HasManyAddAssociationMixin<ListItem, number>;
    declare addItems: HasManyAddAssociationsMixin<ListItem, number>;
    declare setItems: HasManySetAssociationsMixin<ListItem, number>;
    declare removeItem: HasManyRemoveAssociationMixin<ListItem, number>;
    declare removeItems: HasManyRemoveAssociationsMixin<ListItem, number>;
    declare hasItem: HasManyHasAssociationMixin<ListItem, number>;
    declare hasItems: HasManyHasAssociationsMixin<ListItem, number>;
    declare countItems: HasManyCountAssociationsMixin;
    declare createItem: HasManyCreateAssociationMixin<ListItem, 'listId'>;

    declare getMembers: HasManyGetAssociationsMixin<ListMember>;
    declare addMember: HasManyAddAssociationMixin<ListMember, number>;
    declare addMembers: HasManyAddAssociationsMixin<ListMember, number>;
    declare setMembers: HasManySetAssociationsMixin<ListMember, number>;
    declare removeMember: HasManyRemoveAssociationMixin<ListMember, number>;
    declare removeMembers: HasManyRemoveAssociationsMixin<ListMember, number>;
    declare hasMember: HasManyHasAssociationMixin<ListMember, number>;
    declare hasMembers: HasManyHasAssociationsMixin<ListMember, number>;
    declare countMembers: HasManyCountAssociationsMixin;
    declare createMember: HasManyCreateAssociationMixin<ListMember, 'listId'>;

    declare items?: NonAttribute<List[]>;
}

export function initListModel(sequelize: Sequelize): void {
    List.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING(50)
        },
        creatorId: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        joinCode: {
            allowNull: false,
            type: DataTypes.STRING(6).BINARY,
            unique: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        deletedAt: false,
        indexes: [],
        sequelize: sequelize,
        tableName: "lists",
    });
}