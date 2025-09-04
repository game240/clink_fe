export interface SectionItem {
  title: string;
  content?: string;
  children?: SectionItem[];
}

export const organizations: SectionItem[] = [
  {
    title: "연극 단체",
    children: [
      {
        title: "수도권",
        children: [
          {
            title: "가천대학교",
            content: "가천대학교",
            children: [
              {
                title: "아름",
                content: "가천대학교/아름",
              },
            ],
          },
          {
            title: "가톨릭대학교",
            content: "가톨릭대학교",
            children: [
              {
                title: "성심극예술연구회",
                content: "가톨릭대학교/성심극예술연구회",
              },
            ],
          },
          {
            title: "경기대학교",
            content: "경기대학교",
            children: [
              {
                title: "나루극예술연구회",
                content: "경기대학교/나루극예술연구회",
              },
            ],
          },
          {
            title: "경희대학교 (국제)",
            content: "경희대학교 (국제)",
            children: [
              {
                title: "경희극회",
                content: "경희대학교 (국제)/경희극회",
              },
            ],
          },
          {
            title: "광운대학교",
            content: "광운대학교",
            children: [
              {
                title: "광운극예술연구회",
                content: "광운대학교/광운극예술연구회",
              },
            ],
          },
          {
            title: "단국대학교 (죽전)",
            content: "단국대학교 (죽전)",
            children: [
              {
                title: "극예술연구회",
                content: "단국대학교 (죽전)/극예술연구회",
              },
            ],
          },
          {
            title: "서울시립대학교",
            content: "서울시립대학교",
            children: [
              {
                title: "극예술연구회",
                content: "서울시립대학교/극예술연구회",
              },
            ],
          },
          {
            title: "성균관대학교",
            content: "성균관대학교",
            children: [
              {
                title: "능라촌",
                content: "성균관대학교/능라촌",
              },
            ],
          },
          {
            title: "이화여자대학교",
            content: "이화여자대학교",
            children: [
              {
                title: "총연극회",
                content: "이화여자대학교/총연극회",
              },
            ],
          },
          {
            title: "인하대학교",
            content: "인하대학교",
            children: [
              {
                title: "인하극예술연구회",
                content: "인하대학교/인하극예술연구회",
              },
            ],
          },
          {
            title: "중앙대학교",
            content: "중앙대학교",
            children: [
              {
                title: "영죽무대",
                content: "중앙대학교/영죽무대",
              },
            ],
          },
          {
            title: "한성대학교",
            content: "한성대학교",
            children: [
              {
                title: "낙산극회",
                content: "한성대학교/낙산극회",
              },
            ],
          },
          {
            title: "한양대학교 (에리카)",
            content: "한양대학교 (에리카)",
            children: [
              {
                title: "무대 밖의 삐에로",
                content: "한양대학교 (에리카)/무대 밖의 삐에로",
              },
              {
                title: "살판",
                content: "한양대학교 (에리카)/살판",
              },
            ],
          },
          {
            title: "협성대학교",
            content: "협성대학교",
            children: [
              {
                title: "띠앗",
                content: "협성대학교/띠앗",
              },
            ],
          },
          {
            title: "홍익대학교",
            content: "홍익대학교",
            children: [
              {
                title: "홍익극예술연구회",
                content: "홍익대학교/홍익극예술연구회",
              },
            ],
          },
        ],
      },
      {
        title: "강원권",
        children: [
          {
            title: "연세대학교 (미래)",
            content: "연세대학교 (미래)",
            children: [
              {
                title: "외솔극회",
                content: "연세대학교 (미래)/외솔극회",
              },
            ],
          },
        ],
      },
      {
        title: "충청권",
        children: [
          {
            title: "건국대학교 (글로컬)",
            content: "건국대학교 (글로컬)",
            children: [
              {
                title: "극단 소솜",
                content: "건국대학교 (글로컬)/극단 소솜",
              },
              {
                title: "건국극회 한울",
                content: "건국대학교 (글로컬)/건국극회 한울",
              },
            ],
          },
          {
            title: "남서울대학교",
            content: "남서울대학교",
            children: [
              {
                title: "아름다운 사람들",
                content: "남서울대학교/아름다운 사람들",
              },
            ],
          },
          {
            title: "충북대학교",
            content: "충북대학교",
            children: [
              {
                title: "시네씨아",
                content: "충북대학교/시네씨아",
              },
            ],
          },
          {
            title: "공주대학교",
            content: "공주대학교",
            children: [
              {
                title: "동선",
                content: "공주대학교/동선",
              },
            ],
          },
        ],
      },
      {
        title: "전라권",
        children: [
          {
            title: "광주과학기술원",
            content: "광주과학기술원",
            children: [
              {
                title: "지대로",
                content: "광주과학기술원/지대로",
              },
            ],
          },
          {
            title: "전남대학교",
            content: "전남대학교",
            children: [
              {
                title: "전대극회",
                content: "전남대학교/전대극회",
              },
            ],
          },
        ],
      },
      {
        title: "경상권",
        children: [
          {
            title: "경일대학교",
            content: "경일대학교",
            children: [
              {
                title: "열린무대",
                content: "경일대학교/열린무대",
              },
            ],
          },
          {
            title: "동국대학교 (WISE)",
            content: "동국대학교 (WISE)",
            children: [
              {
                title: "동국연극회",
                content: "동국대학교 (WISE)/동국연극회",
              },
            ],
          },
        ],
      },
      {
        title: "제주권",
      },
    ],
  },
  {
    title: "뮤지컬 단체",
  },
];
