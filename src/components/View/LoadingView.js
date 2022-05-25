import React, {useEffect, useState} from "react"
import './LoadingView.css'


function LoadingView() {
    const [curCome, setCurCome] = useState('.')

    function getText() {
        return 'Загрузка' + curCome
    }

    useEffect(() => {
        const massCome = ['.', '..', '...']
        let i = 0
        const timer = setInterval(() => {
            setCurCome(massCome[i])
            i++
            if (i > 2) i = 0
        }, 300)
        return function () {
            clearInterval(timer)
        }
    }, []);

    return (
        <div className='loading__background'>
            <div className="loading__text">
                {getText()}
            </div>
        </div>
    )
}

export default LoadingView