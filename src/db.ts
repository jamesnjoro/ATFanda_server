import {Model,InferAttributes,InferCreationAttributes,CreationOptional,DataTypes,Sequelize} from 'sequelize'

const sequelize = new Sequelize('atfanda','root','password',{
    host:'localhost',
    dialect:'mysql'
})

export class User extends Model<InferAttributes<User>,InferCreationAttributes<User>>{
    declare id:CreationOptional<number>;
    declare number:number;
    declare password:string;
}

User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey:true,
      autoIncrement:true
    },
    number: {
      type: DataTypes.BIGINT,
      allowNull:false
    },
    password:{
        type: DataTypes.STRING(200),
        allowNull:false
    }
  }, {
    sequelize,
    modelName: 'User' 
  });

export class Fundraiser extends Model<InferAttributes<Fundraiser>,InferCreationAttributes<Fundraiser>>{
    declare id:CreationOptional<number>;
    declare name:string;
    declare target:number;
    declare user_id:number;
}

Fundraiser.init({
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    target:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    user_id:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    }
},{
sequelize,
modelName:'Fundraiser'})
