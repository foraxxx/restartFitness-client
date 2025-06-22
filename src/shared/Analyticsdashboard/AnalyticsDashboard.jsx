import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Card, Col, Row, Statistic, Spin } from "antd";
import AnalyticService from "../../services/analyticService";

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [clientsCount, setClientsCount] = useState(0);
  const [activeMemberships, setActiveMemberships] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [yearlyIncome, setYearlyIncome] = useState(0);
  const [newClients, setNewClients] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [publishedReviews, setPublishedReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const [incomeData, setIncomeData] = useState([]);
  const [membershipTypeData, setMembershipTypeData] = useState([]);
  const [popularMemberships, setPopularMemberships] = useState([]);
  const [newUsersData, setNewUsersData] = useState([]);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const response = await AnalyticService.getAnalytic();
        const data = response.data;

        setClientsCount(data.clientsCount);
        setActiveMemberships(data.activeMemberships);
        setMonthlyIncome(data.monthlyIncome);
        setYearlyIncome(data.yearlyIncome);
        setNewClients(data.newClients);
        setReviewsCount(data.reviewsCount);
        setPublishedReviews(data.publishedReviews);
        setAverageRating(parseFloat(data.averageRating));

        setIncomeData(data.incomeData.map(({ month, income }) => ({
          name: month, value: Number(income)
        })));

        setMembershipTypeData(data.membershipTypeData.map(({ type, value }) => ({
          name: type, value: Number(value)
        })));

        setPopularMemberships(
          data.popularMemberships.map(({ name, sales }) => ({
            name,
            value: Number(sales),
          }))
        );

        setNewUsersData(
          data.newUsersData.map(({ date, users }) => ({
            name: date,
            value: Number(users),
          }))
        );
      } catch (error) {
        console.error("Ошибка загрузки аналитики", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const monthMap = {
    Jan: 'Январь',
    Feb: 'Февраль',
    Mar: 'Март',
    Apr: 'Апрель',
    May: 'Май',
    Jun: 'Июнь',
    Jul: 'Июль',
    Aug: 'Август',
    Sep: 'Сентябрь',
    Oct: 'Октябрь',
    Nov: 'Ноябрь',
    Dec: 'Декабрь',
  };


  const getBarChartOption = (title, data) => ({
    title: {
      text: title,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      top: 60,
      left: 60,
      right: 30,
      bottom: 60,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map(d => {
        const key = d.name || d.month || d.date;
        // если это месяц на англ, переводим
        return monthMap[key] || key;
      }),
      axisLabel: {
        rotate: 30,
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12,
        formatter: '{value}',
      },
    },
    series: [
      {
        data: data.map(d => d.value || d.income || d.sales || d.users),
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
          color: '#5470C6',
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
        },
      },
    ],
  });


  const getLineChartOption = (title, data) => ({
    title: { text: title },
    tooltip: {},
    xAxis: { type: "category", data: data.map(d => d.name) },
    yAxis: { type: "value" },
    series: [{
      data: data.map(d => d.value),
      type: "line",
      smooth: true,
      lineStyle: { width: 3 },
      areaStyle: {},
    }]
  });

  const getPieChartOption = (title, data) => ({
    title: { text: title, left: "center" },
    tooltip: { trigger: "item" },
    legend: { bottom: 10, left: "center" },
    series: [{
      name: title,
      type: "pie",
      radius: "50%",
      data,
      label: {
        show: false, // убирает текст с кусков круговой диаграммы
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        }
      }
    }]
  });

  return (
    <div>
      <h3 className="content-title">Аналитика</h3>
      <Row gutter={[16, 16]}>
        <Col span={6}><Card><Statistic title="Количество клиентов" value={clientsCount} /></Card></Col>
        <Col span={6}><Card><Statistic title="Активные абонементы" value={activeMemberships} /></Card></Col>
        <Col span={6}><Card><Statistic title="Доход за месяц" value={monthlyIncome} suffix="₽" /></Card></Col>
        <Col span={6}><Card><Statistic title="Доход за год" value={yearlyIncome} suffix="₽" /></Card></Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16}} >
        <Col span={6}><Card style={{ flex: 1 }}><Statistic title="Количество новых клиентов за месяц" value={newClients} /></Card></Col>
        <Col span={6}><Card style={{ flex: 1 }}><Statistic title="Всего написано отзывов" value={reviewsCount} /></Card></Col>
        <Col span={6}><Card style={{ flex: 1 }}><Statistic title="Опубликовано отзывов" value={publishedReviews} /></Card></Col>
        <Col span={6}><Card style={{ flex: 1 }}><Statistic title="Средняя оценка отзывов" value={averageRating} suffix="★" /></Card></Col>
      </Row>

      <Spin spinning={loading} style={{ marginTop: 24 }}>
        <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
          <Col span={24}><Card><ReactECharts option={getBarChartOption("Доход по месяцам", incomeData)} /></Card></Col>
        </Row>
        <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
          <Col span={24}><Card><ReactECharts option={getPieChartOption("Продажи по типам абонементов", membershipTypeData)} /></Card></Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
          <Col span={12}><Card><ReactECharts option={getBarChartOption("Популярные абонементы", popularMemberships)} /></Card></Col>
          <Col span={12}><Card><ReactECharts option={getLineChartOption("Новые пользователи", newUsersData)} /></Card></Col>
        </Row>
      </Spin>
    </div>
  );
};

export default AnalyticsDashboard;
