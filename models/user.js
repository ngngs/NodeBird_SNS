const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email:{
                type: Sequelize.STRING(40),
                allowNull: true,    // 카카오톡 로그인 기능 시 없어도 된다
                unique: true,   // 단 기입된다면 중복되면 안된다
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull : false,
                defaultValue: 'local'
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true, // createdAt, updatedAt 을 비교함
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true, // deletedAt : 유저삭제일이 기입되면 데이터를 비활성화(soft delete)
            charset: 'utf8',
            collate : 'utf8_general_ci',
            })
    }

    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {    // 팔로워
            foreignKey: 'followingId',  // 찾을 사람의 ID를 먼저 찾아야
            as: 'Followers',            // 팔로워를 찾을 수 있다
            through: 'Follow'

        })
        db.User.belongsToMany(db.User, {    // 팔로잉
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow'
        })
    }
}

module.exports = User;
