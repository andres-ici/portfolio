import React from "react";
import "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears, faCode, faServer } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/Expertise.scss";

const skillGroups = [
  {
    icon: faGears,
    title: "Automatización y Control Industrial",
    description:
      "Control PID, instrumentación y sensores industriales, programación de PLC y DCS Emerson, y prototipado de IoT con microcontroladores y diseño de PCB.",
    labels: [
      "PLC",
      "DCS Emerson",
      "Control PID",
      "Instrumentación industrial",
      "Sensores industriales",
      "Arduino",
      "ESP32",
      "STM32 / PIC",
      "Raspberry Pi",
      "PCB (KiCad)",
    ],
  },
  {
    icon: faCode,
    title: "Desarrollo de Software",
    description:
      "Desarrollo en Python y C/C++, aplicaciones web con React y TypeScript, bases de datos SQL y automatización con Google Apps Script y análisis de datos.",
    labels: [
      "Python",
      "C / C++",
      "React",
      "TypeScript",
      "JavaScript",
      "Flask",
      "SQL",
      "Google Apps Script",
      "Análisis de datos",
    ],
  },
  {
    icon: faServer,
    title: "Infraestructura, IA y Herramientas",
    description:
      "Despliegue de contenedores y administración de entornos Linux, control de versiones con Git, soluciones de IA con LLM e IBM Watson, y prototipos con impresión 3D.",
    labels: [
      "Docker",
      "Linux",
      "Git",
      "Detección de objetos",
      "LLM",
      "IBM Watson",
      "Streamlit",
      "Impresión 3D",
    ],
  },
];

function Expertise() {
  return (
    <section className="section" id="expertise">
      <div className="section__inner">
        <div className="section-heading">
          <p className="eyebrow">01 / Competencias</p>
          <h2>Competencias técnicas</h2>
          <p>
            Automatización, desarrollo de software e infraestructura: las áreas
            donde concentro mi experiencia profesional.
          </p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <article
              className="skill glass glass--interactive"
              key={group.title}
            >
              <div className="skill__head">
                <span className="skill__icon">
                  <FontAwesomeIcon icon={group.icon} />
                </span>
                <span className="skill__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3>{group.title}</h3>
              <p>{group.description}</p>

              <div className="skill__tech">
                <span className="chip-title">Tecnologías</span>
                <div className="chips">
                  {group.labels.map((label) => (
                    <span className="chip" key={label}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Expertise;
