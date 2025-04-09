import React, { useState } from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: 6rem 5%;
  background-color: #f8f9fa;
`;

const SectionContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FaqItem = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FaqQuestion = styled.div<{ isOpen: boolean }>`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: ${props => props.isOpen ? '#f8f9fa' : '#fff'};
  border-bottom: ${props => props.isOpen ? '1px solid #dee2e6' : 'none'};
`;

const QuestionText = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ToggleIcon = styled.div<{ isOpen: boolean }>`
  width: 24px;
  height: 24px;
  position: relative;
  
  &:before,
  &:after {
    content: '';
    position: absolute;
    background-color: #0077B5;
    transition: all 0.3s ease;
  }
  
  &:before {
    width: 100%;
    height: 2px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  
  &:after {
    width: 2px;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%) ${props => props.isOpen ? 'scaleY(0)' : 'scaleY(1)'};
  }
`;

const FaqAnswer = styled.div<{ isOpen: boolean }>`
  padding: ${props => props.isOpen ? '1.5rem' : '0 1.5rem'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  opacity: ${props => props.isOpen ? 1 : 0};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const AnswerText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #6c757d;
  margin: 0;
`;

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const faqs = [
    {
      question: "O que é o Linkgrow e como ele funciona?",
      answer: "O Linkgrow é uma plataforma completa para gerenciamento e crescimento da sua presença no LinkedIn. Ele funciona automatizando tarefas como agendamento de posts, criação de conteúdo com IA, design de carrosséis profissionais e análise de métricas de engajamento. Nossa tecnologia permite que você economize tempo enquanto maximiza seus resultados na plataforma."
    },
    {
      question: "Preciso ter conhecimentos técnicos para usar o Linkgrow?",
      answer: "Não! O Linkgrow foi desenvolvido para ser extremamente intuitivo e fácil de usar. Nossa interface amigável permite que qualquer pessoa, independentemente do nível técnico, possa aproveitar todos os recursos da plataforma. Além disso, oferecemos tutoriais detalhados e suporte dedicado para ajudá-lo em cada etapa."
    },
    {
      question: "Como o Linkgrow pode me ajudar a crescer no LinkedIn?",
      answer: "O Linkgrow potencializa seu crescimento no LinkedIn de várias formas: criando conteúdo de alta qualidade com nosso assistente de IA, agendando posts nos melhores horários para maximizar o engajamento, automatizando interações com seu público, fornecendo análises detalhadas de desempenho e muito mais. Nossos usuários relatam um aumento médio de 300% em suas conexões e engajamento em apenas 3 meses."
    },
    {
      question: "Posso gerenciar múltiplas contas do LinkedIn com o Linkgrow?",
      answer: "Sim! Nossos planos Pro e Enterprise permitem gerenciar múltiplas contas do LinkedIn a partir de um único painel. Isso é ideal para agências, equipes de marketing ou profissionais que gerenciam perfis pessoais e empresariais simultaneamente."
    },
    {
      question: "O Linkgrow é seguro? Como vocês protegem meus dados?",
      answer: "A segurança é nossa prioridade. O Linkgrow utiliza criptografia de ponta a ponta para proteger seus dados e credenciais. Não armazenamos senhas e utilizamos protocolos OAuth seguros para integração com o LinkedIn. Além disso, estamos em conformidade com as principais regulamentações de proteção de dados, incluindo GDPR e LGPD."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Absolutamente! Não exigimos contratos de longo prazo e você pode cancelar sua assinatura a qualquer momento. Se você cancelar uma assinatura anual, poderá continuar usando o serviço até o final do período pago. Oferecemos também uma garantia de reembolso de 14 dias para novos assinantes."
    },
    {
      question: "Como funciona o assistente de IA para criação de conteúdo?",
      answer: "Nosso assistente de IA analisa seu perfil, nicho de atuação e tendências do LinkedIn para sugerir tópicos relevantes e gerar conteúdo personalizado. Você pode fornecer algumas palavras-chave ou um tema geral, e o assistente criará um post completo que você pode editar e personalizar antes de publicar. A IA também aprende com o tempo, melhorando suas sugestões com base no desempenho dos seus posts anteriores."
    },
    {
      question: "O Linkgrow oferece integração com outras redes sociais além do LinkedIn?",
      answer: "Atualmente, nosso foco principal é o LinkedIn, permitindo oferecer recursos especializados e otimizados para esta plataforma. No entanto, o plano Enterprise já inclui integração com Twitter, e estamos trabalhando para adicionar outras redes sociais como Facebook e Instagram em breve. Fique atento às nossas atualizações!"
    }
  ];
  
  return (
    <SectionContainer id="faq">
      <SectionContent>
        <SectionHeader>
          <SectionTitle>Perguntas Frequentes</SectionTitle>
          <SectionSubtitle>
            Encontre respostas para as dúvidas mais comuns sobre o Linkgrow e como ele pode ajudar você.
          </SectionSubtitle>
        </SectionHeader>
        
        <FaqList>
          {faqs.map((faq, index) => (
            <FaqItem key={index}>
              <FaqQuestion 
                isOpen={openIndex === index}
                onClick={() => toggleFaq(index)}
              >
                <QuestionText>{faq.question}</QuestionText>
                <ToggleIcon isOpen={openIndex === index} />
              </FaqQuestion>
              
              <FaqAnswer isOpen={openIndex === index}>
                <AnswerText>{faq.answer}</AnswerText>
              </FaqAnswer>
            </FaqItem>
          ))}
        </FaqList>
      </SectionContent>
    </SectionContainer>
  );
};

export default FaqSection;
