<script>
import axios from "axios";

export default {
  data() {
    return {
      leads: [],
      query: "",
      isLeadsLoading: false,
      columns: [
        {
          title: "Название",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Бюджет",
          dataIndex: "budget",
          key: "budget",
        },
        {
          title: "Статус",
          dataIndex: "status",
          key: "status",
        },
        {
          title: "Ответственный",
          dataIndex: "responsible",
          key: "responsible",
        },
        {
          title: "Дата",
          key: "date",
          dataIndex: "date",
        },
      ],
    };
  },
  methods: {
    async fetchLeads(search = "") {
      this.isLeadsLoading = true;
      const query = search ? `?query=${search}` : "";

      const response = await axios
        .get("http://localhost:3000/leads" + query)
        .catch((error) => (this.leads = []));
      if (!response.data) {
        this.leads = [];
        this.isLeadsLoading = false;
        return;
      }

      this.leads = response.data.map((lead, index) => {
        return {
          key: lead.id,
          name: lead.name,
          budget: `${lead.price}₽`,
          status: { statusName: lead.statusName, color: lead.color },
          responsible: lead.user,
          date: `${new Date(lead.created_at * 1000).getDate()}.${new Date(
            lead.created_at * 1000
          ).getMonth()}.${new Date(lead.created_at * 1000).getFullYear()}`,
        };
      });

      this.isLeadsLoading = false;
    },
    searchInput(search) {
      if (search.length == 0) {
        this.fetchLeads(search);
      }

      if (search.length < 3) {
        return;
      }
      console.log(search);
      this.fetchLeads(search);
    },
  },
  mounted() {
    this.fetchLeads();
  },
};
</script>

<template>
  <div class="leads">
    <div class="input-wrap">
      <h2 class="title">Пример тестового задания</h2>
      <a-input-search
        v-model:value="query"
        placeholder="Поиск"
        enter-button
        class="input-search"
        @search="searchInput"
      />
    </div>

    <a-spin :spinning="isLeadsLoading">
      <a-table :columns="columns" :data-source="leads" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <span>
              <a-tag
                :key="record.status.statusName"
                :color="record.status.color"
                class="tag"
              >
                {{ record.status.statusName }}
              </a-tag>
            </span>
          </template>
        </template>
      </a-table>
    </a-spin>
  </div>
</template>

<style>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

body {
  background-color: #f0f2f5;
}

.leads {
  margin: 0 auto;
  max-width: 100%;
  width: 1280px;
  padding: 20px;
}

.input-wrap {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.title {
  margin-bottom: auto;
}

.input-search {
  max-width: 200px;
  margin-left: auto;
}

.tag {
  color: black !important;
}
</style>
