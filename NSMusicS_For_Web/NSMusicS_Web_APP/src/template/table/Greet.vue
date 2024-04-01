<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :max-height="1000"
    :scroll-x="1800"
    virtual-scroll
  />
</template>

<script setup lang="ts">
import { h } from 'vue'
import { NImage, type DataTableColumns } from 'naive-ui'

type RowData = {
  key: number
  name: string
  age: number
  address: string
  image_src:string
}

const columns: DataTableColumns<RowData> = [
  {
    type: 'selection',
    fixed: 'left'
  },
  {
    title: 'medium_image_url',
    key: 'medium_image_url',
    width: '76px',
    ellipsis: {
      tooltip: true
    },
    render(row) {
      return h(
        NImage,
        {
          height: '50px',
          objectFit: 'cover',
          lazy: true,
          style: {
            borderRadius: '6px',
          },
          src: row.image_src,
        },
        { default: () => '' }
      );
    }
  },
  {
    title: 'Name',
    key: 'name',
    width: 200,
    fixed: 'left'
  },
  {
    title: 'Age',
    key: 'age',
    width: 100,
    fixed: 'left'
  },
  {
    title: 'Row',
    key: 'row',
    render (_row, index) {
      return h('span', ['row ', index])
    }
  },
  {
    title: 'Row1',
    key: 'row1',
    render (_row, index) {
      return h('span', ['row ', index])
    }
  },
  {
    title: 'Row2',
    key: 'row2',
    render (_row, index) {
      return h('span', ['row ', index])
    },
    width: 100,
    fixed: 'right'
  },
  {
    title: 'Address',
    key: 'address',
    width: 200,
    fixed: 'right'
  }
]

const data: RowData[] = Array.from({ length: 5000 }).map((_, index) => ({
  key: index,
  name: `Edward King ${index}`,
  age: 32,
  address: `London, Park Lane no. ${index}`,
  image_src:'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
}))
</script>