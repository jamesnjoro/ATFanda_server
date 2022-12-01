import {Model,InferAttributes,InferCreationAttributes,CreationOptional,DataTypes,Sequelize} from 'sequelize'

export const sequelize = new Sequelize('atfanda','root','password',{
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
      allowNull:false,
      unique:true
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

export class Participant extends Model<InferAttributes<Participant>,InferCreationAttributes<Participant>>{
    declare id:CreationOptional<number>;
    declare name:string;
    declare number:number;
}

Participant.init({
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING(150),
        allowNull:false
    },
    number:{
        type:DataTypes.BIGINT,
        allowNull:false
    }
},{
    sequelize,
    modelName:'Participant'
})

export class Pledge extends Model<InferAttributes<Pledge>,InferCreationAttributes<Pledge>>{
    declare id:CreationOptional<number>;
    declare participant_id:number;
    declare fundraiser_id:number;
    declare amount:number;
    declare source:string;
}

Pledge.init({
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true
    },
    participant_id:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    fundraiser_id:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    amount:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    source:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    modelName:'Pledge'
})

export class Contribution extends Model<InferAttributes<Contribution>,InferCreationAttributes<Contribution>>{
    declare id:CreationOptional<number>;
    declare participant_id:number
    declare fundraiser_id:number;
    declare amount:number;
    declare source:string;
}

Contribution.init({
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true
    },
    participant_id:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    fundraiser_id:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    amount:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    source:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    modelName:'Contribution'
})

export class Sms extends Model<InferAttributes<Sms>,InferCreationAttributes<Sms>>{
    declare id:CreationOptional<number>;
    declare participant_id:number
    declare sms_type:number;
    declare msg:string;
}

Sms.init({
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true
    },
    participant_id:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    sms_type:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    msg:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    modelName:'Sms'
})