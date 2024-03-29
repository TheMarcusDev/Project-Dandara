import { db } from "./firebase-config";
import { setDoc, doc } from 'firebase/firestore';
import { useContext } from 'react';
import { AuthContext } from './AuthContex';
import { UserContext } from './UserDataContext';
import { useNavigate } from 'react-router-dom';
import "../Styles/login.css";
import click from "../../sounds/click.mp3";

export const SetNewPlayerName = () => {
    const { user } = useContext(AuthContext);
    const { setMoney, setPlayerName, playerName, setId, setCurrentQuest, setFollowers, setRespect, setBillboard, setShowLevelOnce, setAvatarRef } = useContext(UserContext);

    const navigate = useNavigate();

    const createUserHandler = async (e) => {
        e.preventDefault();
        //usuario nao existe, criando entrada no firebase
        await setDoc(doc(db, "users", user.email), {
            name: playerName,
            money: 1000,
            email: user.email,
            quest: 0,
            disabledSede: false,
            sedeCountdown: 0,
            campaignCountdown: 0,
            followers: 100,
            respect: 1,
            campaignResult: 0,
            activeCampaign: null,
            guest: null,
            billboard: false,
            showlevelonce: 2,
        });
        setId(user.email);
        setMoney(1000);
        setCurrentQuest(0);
        setFollowers(100);
        setRespect(1);
        setBillboard(false);
        setShowLevelOnce(2);
        setAvatarRef(null);
        navigate('/MainGameWindow');
    }
    return <div className="login">
        <form onSubmit={createUserHandler}>
            <h5>Escolha um nome</h5>
            <h5>para seu personagem:</h5>
            <input type="text" placeholder="Nome:" onChange={event => setPlayerName(event.target.value)} required />
            <button onClick={() => new Audio(click).play()} type="submit">Jogar!</button>
        </form>
    </div>
}
