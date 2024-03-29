import { useContext, useEffect, useState } from "react";
import { db } from "../BackgrondTasks/firebase-config";
import { UserContext } from '../BackgrondTasks/UserDataContext';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from "framer-motion";
import click from "../../sounds/click.mp3";
import plus from "../../sounds/plus.mp3";
import minus from "../../sounds/minus.mp3";

export const CampaignCreation = () => {

    const { campaign, campaignCost, respect, setCampaign, campaignResult, setCampaignResult, id, setActiveCampaign, setCampaignStars, money, setMoney, guest, currentQuest, setCurrentQuest, setCampaignDonations } = useContext(UserContext);

    const [AvaliablePoints, setAvaliablePoints] = useState(respect * 10);
    const [ArtPoints, setArtPoints] = useState(0);
    const [ArtMultiplier, setArtMultiplier] = useState();
    const [TextPoints, setTextPoints] = useState(0);
    const [TextMultiplier, setTextMultiplier] = useState();
    const [VideoPoints, setVideoPoints] = useState(0);
    const [VideoMultiplier, setVideoMultiplier] = useState();
    const [MusicPoints, setMusicPoints] = useState(0);
    const [MusicMultiplier, setMusicMultiplier] = useState();

    const Ref = doc(db, 'users', id)

    function resultFollowers(min, max) {
        return Math.random() * (max - min) + min;
    }

    function weights(art, text, video, music) {
        return (
            (Math.max(0, (art - ArtPoints)) + Math.max(0, (text - TextPoints)) + Math.max(0, (video - VideoPoints)) + Math.max(0, (music - MusicPoints))) * 10
        )
    }

    function calcDonations(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const defineDonations = () => {
        if (campaign === "Outdoors") {
            setCampaignDonations(calcDonations(2, 4))
        }
        if (campaign === "Jornais e Revistas") {
            setCampaignDonations(calcDonations(3, 5))
        }
        if (campaign === "Rádio") {
            setCampaignDonations(calcDonations(3, 5))
        }
        if (campaign === "Internet") {
            setCampaignDonations(calcDonations(4, 6))
        }
        if (campaign === "Redes Sociais") {
            setCampaignDonations(calcDonations(5, 7))
        }
        if (campaign === "Televisão") {
            setCampaignDonations(calcDonations(6, 8))
        }
    }


    const StarsCount = () => {
        let ArtStars = ArtMultiplier ? Math.floor(ArtPoints / 5) : null
        let TextStars = TextMultiplier ? Math.floor(TextPoints / 5) : null
        let VideoStars = VideoMultiplier ? Math.floor(VideoPoints / 5) : null
        let MusicStars = MusicMultiplier ? Math.floor(MusicPoints / 5) : null
        let newArr = [ArtStars, TextStars, VideoStars, MusicStars];
        setCampaignStars(newArr);
    }

    const UpdateResult = async () => await updateDoc(Ref, { campaignResult: campaignResult })
    const UpdateCountdown = async () => await updateDoc(Ref, { campaignCountdown: (Date.now() + 3600000) })
    const UpdateDisabledCampaign = async () => await updateDoc(Ref, { disabledCampaign: true })
    const UpdateActiveCampaign = async () => await updateDoc(Ref, { activeCampaign: campaign })
    const UpdateMoney = async () => await updateDoc(Ref, { money: money - campaignCost })

    const resetResources = () => {
        setAvaliablePoints(respect * 10);
        setArtPoints(0);
        setTextPoints(0);
        setVideoPoints(0);
        setMusicPoints(0);
    }

    const updateQuest = async () => {
        if (currentQuest === 15) {
            await updateDoc(Ref, {
                quest: currentQuest + 1
            })
            setCurrentQuest(currentQuest + 1)
        }
        if (currentQuest === 14) {
            await updateDoc(Ref, {
                quest: currentQuest + 2
            })
            setCurrentQuest(currentQuest + 2)
        }
    }

    const Comfirm = () => {
        if (AvaliablePoints === 0) {
            setActiveCampaign(campaign);
            UpdateActiveCampaign();
            UpdateDisabledCampaign();
            UpdateResult();
            UpdateCountdown();
            StarsCount();
            UpdateMoney();
            setMoney(money - campaignCost);
            defineDonations();
            updateQuest();
            setCampaign('');
            resetResources();
        }
    }

    useEffect(() => {
        Comfirm();
    }, [campaignResult])

    if (campaign) {

        const CampaignTotal = () => {
            if (campaign === 'Outdoors') {
                setCampaignResult(Math.floor((((ArtMultiplier * ArtPoints) + (TextMultiplier * TextPoints) + (VideoMultiplier * VideoPoints) + (MusicMultiplier * MusicPoints)) * resultFollowers(6, 8) - weights(5, 5, 0, 0)) * (guest ? guest[1] : 1) * (ArtPoints >= 1 ? 1 : .5) * (TextPoints >= 1 ? 1 : .5)));

            }
            if (campaign === 'Jornais e Revistas') {
                setCampaignResult(Math.floor((((ArtMultiplier * ArtPoints) + (TextMultiplier * TextPoints) + (VideoMultiplier * VideoPoints) + (MusicMultiplier * MusicPoints)) * resultFollowers(8, 10) - weights(5, 5, 0, 0)) * (guest ? guest[1] : 1) * (ArtPoints >= 1 ? 1 : .5) * (TextPoints >= 1 ? 1 : .33)));
            }
            if (campaign === 'Rádio') {
                setCampaignResult(Math.floor((((ArtMultiplier * ArtPoints) + (TextMultiplier * TextPoints) + (VideoMultiplier * VideoPoints) + (MusicMultiplier * MusicPoints)) * resultFollowers(12, 14) - weights(0, 5, 0, 5)) * (guest ? guest[1] : 1) * (ArtPoints >= 1 ? 1 : .5) * (TextPoints >= 1 ? 1 : .5)));
            }
            if (campaign === 'Internet') {
                setCampaignResult(Math.floor((((ArtMultiplier * ArtPoints) + (TextMultiplier * TextPoints) + (VideoMultiplier * VideoPoints) + (MusicMultiplier * MusicPoints)) * resultFollowers(15, 17) - weights(5, 5, 5, 5)) * (guest ? guest[1] : 1) * (ArtPoints >= 1 ? 1 : .75) * (TextPoints >= 1 ? 1 : .75) * (VideoPoints >= 1 ? 1 : .75) * (MusicPoints >= 1 ? 1 : .75)));
            }
            if (campaign === 'Redes Sociais') {
                setCampaignResult(Math.floor((((ArtMultiplier * ArtPoints) + (TextMultiplier * TextPoints) + (VideoMultiplier * VideoPoints) + (MusicMultiplier * MusicPoints)) * resultFollowers(22, 25) - weights(5, 5, 5, 5)) * (guest ? guest[1] : 1) * (ArtPoints >= 1 ? 1 : .75) * (TextPoints >= 1 ? 1 : .75) * (VideoPoints >= 1 ? 1 : .75) * (MusicPoints >= 1 ? 1 : .75)));
            }
            if (campaign === 'Televisão') {
                setCampaignResult(Math.floor((((ArtMultiplier * ArtPoints) + (TextMultiplier * TextPoints) + (VideoMultiplier * VideoPoints) + (MusicMultiplier * MusicPoints)) * resultFollowers(50, 60) - weights(5, 5, 5, 5)) * (guest ? guest[1] : 1) * (ArtPoints >= 1 ? 1 : .75) * (TextPoints >= 1 ? 1 : .75) * (VideoPoints >= 1 ? 1 : .75) * (MusicPoints >= 1 ? 1 : .75)));
            }
        }

        const SetMultipliers = () => {
            if (campaign === 'Outdoors') {
                setArtMultiplier(2);
                setTextMultiplier(2);
                setVideoMultiplier(null);
                setMusicMultiplier(null);
            }
            if (campaign === 'Jornais e Revistas') {
                setArtMultiplier(2);
                setTextMultiplier(3);
                setVideoMultiplier(null);
                setMusicMultiplier(null);
            }
            if (campaign === 'Rádio') {
                setArtMultiplier(null);
                setTextMultiplier(3);
                setVideoMultiplier(null);
                setMusicMultiplier(3);
            }
            if (campaign === 'Internet') {
                setArtMultiplier(2);
                setTextMultiplier(3);
                setVideoMultiplier(1);
                setMusicMultiplier(1);
            }
            if (campaign === 'Redes Sociais') {
                setArtMultiplier(2);
                setTextMultiplier(1);
                setVideoMultiplier(3);
                setMusicMultiplier(2);
            }
            if (campaign === 'Televisão') {
                setArtMultiplier(2);
                setTextMultiplier(1);
                setVideoMultiplier(4);
                setMusicMultiplier(2);
            }
        }

        return (

            <motion.div className="overlaypages"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
            >
                <div>
                    <h3>Criação de Campanha para {campaign}</h3>
                    <h4 className="alignright">Custo: {campaignCost} créditos</h4>
                    <h4 className="alignright">Seu créditos: {money}</h4>
                </div>
                <div>
                    <h4>Alocação de Recursos Disponíveis:</h4> <h5>{AvaliablePoints}</h5>
                </div>
                <div>
                    <div className="atributeslist">
                        <h4>Arte Gráfica:</h4>
                        <div className="points">
                            <h5>{ArtPoints}</h5>
                        </div>
                        <div>
                            <button className="smallbutton" onClick={() => { new Audio(plus).play(); setArtPoints(ArtPoints + 1); setAvaliablePoints(AvaliablePoints - 1); SetMultipliers() }} disabled={AvaliablePoints <= 0}>+</button>
                            <button className="smallbutton" onClick={() => { new Audio(minus).play(); setArtPoints(ArtPoints - 1); setAvaliablePoints(AvaliablePoints + 1); SetMultipliers() }} disabled={ArtPoints <= 0}>-</button>
                            <button className="smallbutton" onClick={() => { new Audio(plus).play(); setArtPoints(ArtPoints + 10); setAvaliablePoints(AvaliablePoints - 10); SetMultipliers() }} disabled={AvaliablePoints < 10}>+10</button>
                            <button className="smallbutton" onClick={() => { new Audio(minus).play(); setArtPoints(ArtPoints - 10); setAvaliablePoints(AvaliablePoints + 10); SetMultipliers() }} disabled={ArtPoints < 10}>-10</button>
                        </div>
                    </div>
                    <div className="atributeslist">
                        <h4>Texto:</h4>
                        <div className="points">
                            <h5>{TextPoints}</h5>
                        </div>
                        <div>
                            <button className="smallbutton" onClick={() => { new Audio(plus).play(); setTextPoints(TextPoints + 1); setAvaliablePoints(AvaliablePoints - 1); SetMultipliers() }} disabled={AvaliablePoints <= 0}>+</button>
                            <button className="smallbutton" onClick={() => { new Audio(minus).play(); setTextPoints(TextPoints - 1); setAvaliablePoints(AvaliablePoints + 1); SetMultipliers() }} disabled={TextPoints <= 0}>-</button>
                            <button className="smallbutton" onClick={() => { new Audio(plus).play(); setTextPoints(TextPoints + 10); setAvaliablePoints(AvaliablePoints - 10); SetMultipliers() }} disabled={AvaliablePoints < 10}>+10</button>
                            <button className="smallbutton" onClick={() => { new Audio(minus).play(); setTextPoints(TextPoints - 10); setAvaliablePoints(AvaliablePoints + 10); SetMultipliers() }} disabled={TextPoints < 10}>-10</button>
                        </div>
                    </div>
                    <div className="atributeslist">
                        <h4>Vídeo:</h4>
                        <div className="points">
                            <h5>{VideoPoints}</h5>
                        </div>
                        <div>
                            <button className="smallbutton" onClick={() => { new Audio(plus).play(); setVideoPoints(VideoPoints + 1); setAvaliablePoints(AvaliablePoints - 1); SetMultipliers() }} disabled={AvaliablePoints <= 0}>+</button>
                            <button className="smallbutton" onClick={() => { new Audio(minus).play(); setVideoPoints(VideoPoints - 1); setAvaliablePoints(AvaliablePoints + 1); SetMultipliers() }} disabled={VideoPoints <= 0}>-</button>
                            <button className="smallbutton" onClick={() => { new Audio(plus).play(); setVideoPoints(VideoPoints + 10); setAvaliablePoints(AvaliablePoints - 10); SetMultipliers() }} disabled={AvaliablePoints < 10}>+10</button>
                            <button className="smallbutton" onClick={() => { new Audio(minus).play(); setVideoPoints(VideoPoints - 10); setAvaliablePoints(AvaliablePoints + 10); SetMultipliers() }} disabled={VideoPoints < 10}>-10</button>
                        </div>
                    </div>
                    <div className="atributeslist">
                        <h4>Música:</h4>
                        <div className="points">
                            <h5>{MusicPoints}</h5>
                        </div>
                        <div>
                            <button className="smallbutton" onClick={() => { new Audio(plus).play(); setMusicPoints(MusicPoints + 1); setAvaliablePoints(AvaliablePoints - 1) }} disabled={AvaliablePoints <= 0}>+</button>
                            <button className="smallbutton" onClick={() => { new Audio(minus).play(); setMusicPoints(MusicPoints - 1); setAvaliablePoints(AvaliablePoints + 1) }} disabled={MusicPoints <= 0}>-</button>
                            <button className="smallbutton" onClick={() => { new Audio(plus).play(); setMusicPoints(MusicPoints + 10); setAvaliablePoints(AvaliablePoints - 10) }} disabled={AvaliablePoints < 10}>+10</button>
                            <button className="smallbutton" onClick={() => { new Audio(minus).play(); setMusicPoints(MusicPoints - 10); setAvaliablePoints(AvaliablePoints + 10) }} disabled={MusicPoints < 10}>-10</button>
                        </div>
                    </div>
                </div>
                <h2>Convidado: {guest ? guest[0] : 'Nenhum'}</h2>
                <div>
                    <button onClick={() => { new Audio(click).play(); CampaignTotal() }} disabled={AvaliablePoints > 0 || campaignCost > money}>Confirmar Campanha</button>
                    <button onClick={() => { new Audio(click).play(); setCampaign(''); resetResources() }}>Cancelar Campanha</button>
                </div>
            </motion.div>

        );
    }
}
