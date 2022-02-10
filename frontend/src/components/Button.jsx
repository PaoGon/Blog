import React from 'react';

const STYLES = ['btn--primary', 'btn--outline'];

const COLOR = ['primary', 'light-blue', 'blue', 'orange', 'red', 'green', 'gray'];

const SIZE = ['btn--medium', 'btn--large', 'btn-mobile', 'btn--wide']

export const Button = ({
    children,
    icon,
    type,
    onClick,
    disable,
    buttonStyle,
    buttonColor,
    buttonSize
}) => {
    const btn_style = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

    const btn_color = COLOR.includes(buttonColor) ? buttonColor : null;

    const btn_size = SIZE.includes(buttonSize) ? buttonSize : SIZE[0];
    return (
        <button className={`btn ${btn_style} ${btn_color} ${btn_size}`} onClick={onClick} type={type} disabled={disable}>
            <div className="lab">
                {icon}
                {children}
            </div>


        </button>
    )
}
