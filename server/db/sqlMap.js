var sqlMap = {
    user: {
        slct_user: 'select idj_usr from j_usr',//for judging users' login,
        slct_token: 'select sToken from j_usr',
        slct_user_basic_info: 'select * from info_usr',
        regist_usr1: 'insert into j_usr (passj_usr, usrnj_usr, emailj_usr) values (?,?,?)',
        regist_usr2: 'insert into info_usr (id, uName, uEmail, uDate) values (?,?,?,?);'
    },
    message: {
        insert_message: 'insert into group_message (sId, sName, gId, gName, rId, rName, mTitle, mContent, mDate) values (?,?,?,?,?,?,?,?,?);',
        message2inbox: 'insert into inbox_usr (uId, mId) values (?,?);',
        slct_msgbox: 'select id,sId,sName,gId,gName,rId,rName,mTitle,mContent,mDate,hasRead from group_message',
        read_msg: 'update group_message SET hasRead = 1',
        del_msg: 'update group_message SET delDate'
    },
    group: {
        create_group: 'insert into info_groups (gName,gOwnerId,gOwner,gDesc,gClass,gDate) values (?,?,?,?,?,?);',
        slct_groups: 'SELECT info_groups.* FROM info_groups JOIN (select id, gId from joined_groups where id = ?)t2 ON t2.gId = info_groups.id;',
        slct_groups_d: 'select * from info_groups',
        join_group: 'insert into joined_groups (id,gId,jt) values (?,?,?)',
        del_group:'delete from joined_groups'
    },
    others: {
        tips: "SELECT content FROM index_tips AS t1 JOIN(SELECT ROUND(RAND() * ((SELECT MAX(id) FROM index_tips) - (SELECT MIN(id) FROM index_tips)) + (SELECT MIN(id) FROM index_tips)) AS id) AS t2 WHERE t1.id >= t2.id ORDER BY t1.id LIMIT 1;",
    }
}

module.exports = sqlMap; 