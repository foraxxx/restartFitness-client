import React from "react";
import { Collapse } from "antd";
import "./FAQ.scss";

const { Panel } = Collapse;

const faqData = [
  {
    question: "Что нужно брать с собой в  зал",
    answer: "С собой в зал необходимо брать замочек для шкафчика, спортивную форму и кроссовки, бутылку для воды, мыльные принадлежности и полотенце",
  },
  {
    question: "Могу ли я заморозить свой абонемент?",
    answer: "Да, мы предоставляем возможность заморозки абонемента на срок до одного месяца, если вы не сможете посещать зал по уважительной причине.",
  },
  {
    question: "Какие услуги включены в абонемент?",
    answer: "Абонемент включает доступ в тренажёрный зал, раздевалки, душевые, а также групповые тренировки",
  },
  {
    question: "Могу ли я оформить рассрочку на абонемент?",
    answer: "Возможности оформить абонемент в рассрочку у нас нет.",
  },
];

const FAQ = () => {
  return (
    <div className="faq-container">
      <h2 className="faq-title">Часто задаваемые вопросы</h2>
      <Collapse accordion>
        {faqData.map((item, index) => (
          <Panel header={item.question} key={index}>
            <p>{item.answer}</p>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default FAQ;
