import { BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, CreationOptional, DataTypes, ForeignKey, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import { User } from "./user";
import { ListItem } from './listItem';

export class List extends Model<InferAttributes<List>, InferCreationAttributes<List>> {
    declare public id: CreationOptional<number>;
    declare public name: string;
    declare public creatorId: ForeignKey<User["id"]>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare creator?: NonAttribute<User>;

    declare getCreator: BelongsToGetAssociationMixin<User>;
    declare setCreator: BelongsToSetAssociationMixin<User, User["id"]>;
    declare createCreator: BelongsToCreateAssociationMixin<User>;

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
            allowNull: false,
            type: DataTypes.INTEGER
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