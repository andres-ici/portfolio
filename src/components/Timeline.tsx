import React, { useEffect, useRef, useState } from "react";
import "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/Timeline.scss";

const experience = [
  {
    date: "Ene 2025 – Jun 2025",
    title: "Ingeniero Civil Electrónico – Memoria de Título",
    organization: "Compañía Minera Doña Inés de Collahuasi SCM",
    description:
      "Me incorporé al final del overhaul de la planta de molibdeno para ejecutar la puesta en marcha y definir los puntos de operación de los hidrociclones. Caractericé el funcionamiento previo con datos históricos, implementé lógicas de control en DCS Emerson y entrevisté a operadores. La integración elevó entre 5 y 10 puntos la ley final.",
  },
  {
    date: "Jun 2024 – Jun 2025",
    title: "Representante Estudiantil",
    organization:
      "Centro de Estudiantes de Ingeniería Civil Electrónica – UFRO",
    description:
      "Representé los intereses estudiantiles ante la dirección de carrera, con énfasis en la inclusión de nuevos estudiantes. Organicé visitas industriales a empresas locales para estudiantes de primeros años, con más de 30 participantes.",
  },
  {
    date: "Ago 2023 – Dic 2024",
    title: "Ingeniero de Proyectos – Control Automático",
    organization: "Proyecto de Seguimiento Solar – Universidad de La Frontera",
    description:
      "Integré un equipo de tres personas que desarrolló un prototipo de seguidor solar. Diseñé e implementé un control PI sobre ESP32, con sensor de norte magnético y motores paso a paso con engranajes. Las pruebas confirmaron una ganancia energética de 10 a 15 %.",
  },
  {
    date: "Mar 2023 – Dic 2024",
    title: "Ingeniero de Proyectos – Automatización y TI",
    organization:
      "Línea Integradora de Formación en Ingeniería y Ciencias (LIFIC) – UFRO",
    description:
      "Desarrollé con Google Apps Script soluciones de inventario y asistencia con códigos QR y una base de datos SQL con interfaz en Google Sheets. Integré un script en Python con el sistema PHP de la universidad para transferir la asistencia a los servidores oficiales, eliminando la carga manual.",
  },
  {
    date: "Ago 2021 – Dic 2022",
    title: "Ayudante de Laboratorio – Sensores y Arduino",
    organization:
      "Línea Integradora de Formación en Ingeniería y Ciencias (LIFIC) – UFRO",
    description:
      "Ayudante de Microcontroladores y Sensores, asignatura transversal a las carreras de ingeniería, con grupos de más de 20 estudiantes. Elaboré guías, ejercicios y presentaciones, y apoyé las prácticas de sensores y Arduino.",
  },
  {
    date: "Ago 2020 – Ago 2022",
    title: "Ayudante de Cátedra – Programación de Computadores",
    organization:
      "Facultad de Ingeniería y Ciencias – Universidad de La Frontera",
    description:
      "Ayudante de la asignatura Programación de Computadores (C/C++) durante cuatro semestres. Conduje sesiones semanales con ejercicios de dificultad creciente, resolví dudas y corregí talleres y quizzes.",
  },
  {
    date: "Mar 2021 – Ago 2021",
    title: "Desarrollador de Software (Chatbot IA)",
    organization: "Instituto iDEAUFRO – Universidad de La Frontera",
    description:
      "Entrené un chatbot con la infraestructura de IBM Watson y lo integré al sitio web mediante JavaScript. Quedó operativo y se mantuvo en uso cerca de un año, hasta la actualización del sitio con ChatGPT.",
  },
];

// Entrance animation inspired by the original react-vertical-timeline
// template: each card slides in from its side and the marker pops once the
// item scrolls into view. Without IntersectionObserver or with reduced motion
// the list renders static (no "timeline--animate" class, nothing hidden).
function useTimelineReveal(count: number) {
  const listRef = useRef<HTMLOListElement>(null);
  const [animate, setAnimate] = useState(false);
  // index -> animation delay (ms); items entering together are staggered.
  const [visible, setVisible] = useState<Map<number, number>>(() => new Map());

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") return;

    setAnimate(true);
    const observer = new IntersectionObserver(
      (entries) => {
        const shown: number[] = [];
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          shown.push(Number((entry.target as HTMLElement).dataset.index));
          observer.unobserve(entry.target);
        });
        if (shown.length) {
          shown.sort((a, b) => a - b);
          setVisible((prev) => {
            const next = new Map(prev);
            shown.forEach((index, order) => next.set(index, order * 110));
            return next;
          });
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    Array.from(list.children).forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [count]);

  return { listRef, animate, visible };
}

function Timeline() {
  const { listRef, animate, visible } = useTimelineReveal(experience.length);

  return (
    <section className="section" id="history">
      <div className="section__inner">
        <div className="section-heading">
          <p className="eyebrow">02 / Trayectoria</p>
          <h2>Experiencia profesional y académica</h2>
          <p>
            Proyectos de automatización, control, docencia y desarrollo de
            software desarrollados en la industria y en la Universidad de La
            Frontera.
          </p>
        </div>

        <ol
          ref={listRef}
          className={`timeline ${animate ? "timeline--animate" : ""}`.trim()}
        >
          {experience.map((item, index) => (
            <li
              className={`timeline__item ${
                visible.has(index) ? "is-visible" : ""
              }`.trim()}
              data-index={index}
              key={`${item.date}-${item.title}`}
              style={
                {
                  "--timeline-row": index + 1,
                  "--timeline-delay": `${visible.get(index) ?? 0}ms`,
                } as React.CSSProperties
              }
            >
              <span className="timeline__marker" aria-hidden="true">
                <FontAwesomeIcon icon={faBriefcase} />
              </span>

              <article className="timeline__card glass glass--interactive">
                <div className="timeline__meta">
                  <span className="timeline__date">{item.date}</span>
                  <span className="timeline__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p className="timeline__organization">{item.organization}</p>
                <p className="timeline__description">{item.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Timeline;
