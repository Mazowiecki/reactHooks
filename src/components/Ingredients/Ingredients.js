import React, {useState, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([]);

    useEffect(() => {
        getIngredients();
    }, []);

    const getIngredients = () => {
        fetch('https://reacthooks-3d2ce.firebaseio.com/ingredients.json').then(
            response => response.json()
        ).then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
                loadedIngredients.push({
                    id: key,
                    title: responseData[key].title,
                    amount: responseData[key].amount
                })
            }
            console.log(loadedIngredients);
            setUserIngredients(loadedIngredients);
        });
    };

    const addIngredientHandler = ingredient => {
        fetch('https://reacthooks-3d2ce.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                setUserIngredients(prevIngredients => [
                    ...prevIngredients,
                    {id: responseData.name, ...ingredient}
                ]);
            });
    };

    const deleteIngredientHandler = ingredientId => {
        fetch(`https://reacthooks-3d2ce.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (response.status === 200) {
                    getIngredients();
                }
            })
    };

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler}/>
            <section>
                <IngredientList
                    ingredients={userIngredients}
                    deleteIngredient={deleteIngredientHandler}
                />
            </section>
        </div>
    );
};

export default Ingredients;
