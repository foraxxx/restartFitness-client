import React, {useContext, useEffect, useState} from 'react'
import Header from "../../shared/Header/Header.jsx"
import Section from "../../shared/Section/Section.jsx"
import Grid4 from "../../shared/Grid4/Grid4.jsx"
import {Context} from "../../main.jsx"
import MembershipCard from "../../shared/MembershipCard/MembershipCard.jsx"
import {observer} from "mobx-react-lite"
import TrainerCard from "../../shared/TrainerCard/TrainerCard.jsx"

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
      <Section title={"Абонементы"}>
        <Grid4>
          {memberships.map((membership) => {
            return (
              <MembershipCard key={membership.id} membership={membership} />
            )
          })}
        </Grid4>
      </Section>
      <Section title={"Персональные тренеровки"}>
        <Grid4>
          {trainers.map((trainer) => {
            return (
              <TrainerCard key={trainer.id} trainer={trainer} />
            )
          })}
        </Grid4>
      </Section>
    </div>
  )
}

export default observer(Services)