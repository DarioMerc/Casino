import { createGlobalStyle } from "styled-components";

export const themeVars = {

};

export default createGlobalStyle`
    *{
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
    }
    html,body{
        height: 90vh;
    }
    .automargin{
        text-align:center;
        margin: auto 0px;
    }
    .hspacer{
        height: 100%;
    }
    hr{
        height: 2px;
    width: 100%;
    margin: 0px;
    }
`;
