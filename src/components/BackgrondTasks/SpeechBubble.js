import React, { useState, createContext, useContext } from "react";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../BackgrondTasks/firebase-config";
import { UserContext } from './UserDataContext';
import { useDetectClickOutside } from 'react-detect-click-outside';
import Typewriter from 'typewriter-effect';

export const BubbleContext = createContext({})

export const SpeechBubbleContext = ({ children }) => {

    const [bubble, setBubble] = useState(false);
    const [bubbleText, setBubbleText] = useState('');
    const [bubblePortrait, setBubblePortrait] = useState('');
    const { playerName, currentQuest, setCurrentQuest, id } = useContext(UserContext);

    const questRef = doc(db, 'users', id)

    const updateQuest = async (id, quest) => {
        await updateDoc(questRef, {
            quest: currentQuest + 1
        })
    };

    const RemoveBubble = () => {
        setCurrentQuest(currentQuest + 1);
        setBubble(false);
        setBubbleText('');
        updateQuest();
    }

    const clickedOutside = useDetectClickOutside({ onTriggered: RemoveBubble });

    if (bubble) {
        return (
            <div ref={clickedOutside} onClick={() => { RemoveBubble(); }}>
                <img src='../../img/speechbubble.png' alt="" id="speechbubble" />
                <img src={bubblePortrait} alt="" id="bubblePortrait" />
                <div className="speechbubbletext" >
                    <Typewriter options={{ delay: 30, cursor: null }} className="speechbubbletext"
                        onInit={(typewriter) => {
                            typewriter.typeString(bubbleText)
                                .start();
                        }}
                    />
                </div>
            </div>
        );
    }
    const QuestManager = () => {

        if (playerName) {
            if (currentQuest === 1) {
                const createBubbleText = () => {
                    setBubblePortrait('../../img/Port-Dandara.png');
                    setBubble(true);
                    setBubbleText('Ol?? <p2> ' + playerName + '</p2>! ?? um grande prazer lhe receber em nossa equipe! Se prepare para uma fant??stica jornada cheia de desafios e recompensas! Seu papel, como assistente de campanha, ?? garantir o maior n??mero de apoiadores antes da data das elei????es! Para come??ar, clique na <p2>Sede do Partido</p2> localizada na parte <p2>superior esquerda</p2> do mapa.');
                }
                createBubbleText();
            }
        }
        if (currentQuest === 3) {
            const createBubbleText = () => {
                setBubblePortrait('../../img/Port-Tesoureiro.png');
                setBubble(true);
                setBubbleText('Ol?? <p2> ' + playerName + '</p2>! Eu sou o tesoureiro do partido. Todos os dias voc?? deve visitar a nossa sede para garantir o recebimento do seu or??amento. O valor que voc?? recebe diariamente aumentar?? de acordo com a sua <p2>reputa????o</p2>. Clique agora em <p2>Receber Or??amento</p2>.');
            }
            createBubbleText();
        }
    }

    return (
        <BubbleContext.Provider value={{ setBubble, setBubbleText }}>
            {children}
            {QuestManager()}
        </BubbleContext.Provider>
    )
}