import { useEffect, useState } from "react";
import "./Deck.css";
import axios from "axios";
import Card from "./Card";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

const Deck = () => {
    const [deck, setDeck] = useState(null);
    const [currentCards, setCurrentCards] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(() => {
        const getData = async() => {
            try {
                const response = await axios.get(`${API_BASE_URL}/new/shuffle/`);
                setDeck(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        getData();
    }, []);

    const draw = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);

            if (response.data.remaining === 0) {
                alert("There are no cards remaining!");
                return;
            }

            const card = response.data.cards[0];

            setCurrentCards(cards => [
                ...cards,
                {
                  id: card.code,
                  name: card.suit + " " + card.value,
                  image: card.image,
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    const shuffleDeck = async () => {
        setIsShuffling(true);

        try {
          await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
          setCurrentCards([]);
        } catch (err) {
          alert(err);
        } finally {
          setIsShuffling(false);
        }
      }

    return (
        <div className="Deck">
            <div className="Deck-btn-area">
                {deck && <button className="Deck-btn draw" onClick={draw} disabled={isShuffling}>Draw</button>}
                {deck && <button className="Deck-btn shuffle" onClick={shuffleDeck} disabled={isShuffling}>SHUFFLE</button>}
            </div>
            <div className="Deck-playarea">
                {currentCards.map(card => (
                    <Card key={card.id} name={card.name} image={card.image} />
                ))}
            </div>
        </div>
    )
};

export default Deck;