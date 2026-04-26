import { ChevronUp } from "lucide-react";
import type { Guess, Round } from "../../types";
import utilFunction from "../../util/utilFunction";
import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import "../../style/results/SummaryItem.css";

interface SummaryItemProps {
    round : Round,
    guess : Guess,
    index : number
}

function SummaryItem({round, guess, index} : SummaryItemProps) {
    
    const [developped, setDevelopped] = useState<boolean>(false);
    const store = useGameStore();
    
    const isSubmitter = round.submitterId === guess.playerId;
    const isReported = round.reports.length >= Math.ceil(store.room!.players.length / 2);
    const globalScore = utilFunction.globalLogic(guess, round, isReported);
    const mainAnswerScore = utilFunction.answerLogic(isSubmitter, guess.mainValid, isReported);
    const bonusAnswerScore = utilFunction.answerLogic(isSubmitter, guess.bonusValid, isReported);

    return (
        <div className="si-root">
            <div className="si-header">
                <span className="si-round">
                    Round {index + 1}
                </span>
                {round.submitterId === guess.playerId && (
                    <span className="si-submitter">Vous avez proposé cet extrait</span>
                )}
                {isReported && (
                    <span className="si-reported">Round signalé (aucun point attribué)</span>
                )}
                <span className={`si-score-global ${globalScore > 0 ? "si-score-green" : (globalScore < 0 ? "si-score-red" : "si-score-yellow")}`}>
                    {(globalScore > 0) ? (
                        "+" + globalScore
                    ) : (
                        globalScore
                    )}
                </span>
                <ChevronUp className={`si-chevron ${developped && "si-chevron-down"}`}
                    onClick={() => setDevelopped((prev) => !prev)}/>
            </div>
            {developped && (
                <div className="si-body">
                    <div className="si-body-mainAnswer">
                        <div className="si-answers">
                            <div className="si-waitedAnswer">
                                <div className="si-answer-text">
                                Réponse attendue :
                                </div>
                                <div className="si-answer-slot">
                                    {round.mainAnswer}
                                </div>
                            </div>
                            <div className="si-givenAnswer">
                                <div className="si-answer-text">
                                    Réponse donnée :
                                </div>
                                <div className="si-answer-slot">
                                    {guess.mainAnswer}
                                </div>
                            </div>
                        </div>
                        <div className={`si-answer-score ${mainAnswerScore > 0 ? "si-score-green" : (mainAnswerScore < 0 ? "si-score-red" : "si-score-yellow")}`}>
                            {mainAnswerScore > 0 ? (
                                "+" + mainAnswerScore
                            ) : (
                                mainAnswerScore
                            )}
                        </div>
                    </div>
                    {round.bonusAnswer && (
                        <div className="si-body-bonusAnswer">
                            <div className="si-answers">
                                <div className="si-waitedAnswer">
                                    <div className="si-answer-text">
                                        Bonus attendu :
                                    </div>
                                    <div className="si-answer-slot">
                                        {round.bonusAnswer}
                                    </div>
                                </div>
                                <div className="si-givenAnswer">
                                    <div className="si-answer-text">
                                        Bonus donné :
                                    </div>
                                    <div className="si-answer-slot">
                                        {guess.bonusAnswer}
                                    </div>
                                </div>
                            </div>
                            <div className={`si-answer-score ${bonusAnswerScore > 0 ? "si-score-green" : (bonusAnswerScore < 0 ? "si-score-red" : "si-score-yellow")}`}>
                                {bonusAnswerScore > 0 ? (
                                    "+" + bonusAnswerScore
                                ) : (
                                    bonusAnswerScore
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SummaryItem;