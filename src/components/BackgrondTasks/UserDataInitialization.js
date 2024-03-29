import { db } from "./firebase-config";
import { onSnapshot, doc } from 'firebase/firestore';
import { useContext } from 'react';
import { AuthContext } from './AuthContex';
import { UserContext } from './UserDataContext';
import { SetNewPlayerName } from "./CreateNewUser";
import MainGameWindow from '../../MainGameWindow'

export const UserDataInit = () => {

    const { user } = useContext(AuthContext);
    const { id, setMoney, setPlayerName, setCurrentQuest, setFollowers, setRespect, setBillboard, setShowLevelOnce, setAvatarRef } = useContext(UserContext);

    if (id) {
        if (id === user.email) {
            const userRef = doc(db, 'users', id)
            //usuario ja existe, atualizando dados para base local
            onSnapshot(userRef, (doc) => {
                setMoney(doc.data().money);
                setPlayerName(doc.data().name);
                setCurrentQuest(doc.data().quest);
                setFollowers(doc.data().followers);
                setRespect(doc.data().respect);
                setBillboard(doc.data().billboard);
                setShowLevelOnce(doc.data().showlevelonce)
                setAvatarRef(doc.data().avatarref)
            })
        }
        return <MainGameWindow />
    } else {
        return <SetNewPlayerName />
    }
}