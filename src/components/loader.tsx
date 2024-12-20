import { JSX } from "solid-js";

function Loader(props: { color: string }): JSX.Element {
  return (
    <>
      <span class="loader"></span>
      <style>
        {`
          .loader {
            width: 48px;
            height: 48px;
            border: 5px solid ${props.color};
            border-bottom-color: transparent;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
          }
  
          @keyframes rotation {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          `}
      </style>
    </>
  );
}

export default Loader;
