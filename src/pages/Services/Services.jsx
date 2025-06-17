import React, {useContext, useEffect, useState} from 'react'
import Header from "../../shared/Header/Header.jsx"
import Section from "../../shared/Section/Section.jsx"
import Grid4 from "../../shared/Grid4/Grid4.jsx"
import {Context} from "../../main.jsx"
import MembershipCard from "../../shared/MembershipCard/MembershipCard.jsx"
import {observer} from "mobx-react-lite"
import TrainerCard from "../../shared/TrainerCard/TrainerCard.jsx"
import { Link } from 'react-router-dom'
import Footer from "../../shared/Footer/Footer.jsx"
import {Layout} from "antd"

const Services = (props) => {
  const {membershipStore, trainerStore} = useContext(Context)
  const [memberships, setMemberships] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await membershipStore.getAllActive()
      await trainerStore.getAll()
      setMemberships(membershipStore.memberships)
      setTrainers(trainerStore.trainers)
    }

    fetchData()
  }, [membershipStore, trainerStore])


  return (
    <div>
      <Header/>
      <section>
        <Section title={"Абонементы"}>
          <Grid4>
            {memberships.map((membership) => (
              <Link to={`/membership/${membership.id}`} key={membership.id} style={{ textDecoration: "none" }}>
                <MembershipCard key={membership.id} membership={membership} />
              </Link>
            ))}
          </Grid4>
        </Section>
        {/*<Section title={"Персональные тренеровки"}>*/}
        {/*  <Grid4>*/}
        {/*    {trainers.map((trainer) => (*/}
        {/*      <Link to={`/trainer/${trainer.id}`} key={trainer.id} style={{ textDecoration: "none" }}>*/}
        {/*        <TrainerCard key={trainer.id} trainer={trainer} />*/}
        {/*      </Link>*/}
        {/*      ))}*/}
        {/*  </Grid4>*/}
        {/*</Section>*/}
      </section>
      <Footer/>
    </div>
  )
}

export default observer(Services)