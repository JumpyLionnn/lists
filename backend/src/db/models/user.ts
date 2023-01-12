import { CreationOptional, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, Sequelize, NonAttribute } from 'sequelize';
import { List } from './list';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare public email: string;
    declare public id: CreationOptional<number>;
    declare public password: string;
    declare public username: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;


    declare getLists: HasManyGetAssociationsMixin<List>;
    declare addList: HasManyAddAssociationMixin<List, number>;
    declare addLists: HasManyAddAssociationsMixin<List, number>;
    declare setLists: HasManySetAssociationsMixin<List, number>;
    declare removeList: HasManyRemoveAssociationMixin<List, number>;
    declare removeLists: HasManyRemoveAssociationsMixin<List, number>;
    declare hasList: HasManyHasAssociationMixin<List, number>;
    declare hasLists: HasManyHasAssociationsMixin<List, number>;
    declare countLists: HasManyCountAssociationsMixin;
    declare createList: HasManyCreateAssociationMixin<List, 'creatorId'>;

    declare lists?: NonAttribute<List[]>;
}

export function initUserModel(sequelize: Sequelize): void {
    User.init({
        email: {
            allowNull: false,
            type: DataTypes.STRING(50)
        },
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING(60)
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING(50)
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        deletedAt: false,
        indexes: [
            {
                unique: true, 
                fields: ['email']
            },
            {
                unique: true, 
                fields: ["id"]
            }
        ],
        sequelize: sequelize,
        tableName: "users",
    });
}