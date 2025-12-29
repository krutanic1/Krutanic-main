import React from 'react'

const Skills = () => {
    
    const skills = [
        {
          name: "Python",
          logo: "https://imgs.search.brave.com/Gc4o0TZByHDXOrUog0t60tOvt-BmVp3pOLjo8FdPnCM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy81/ODQ4MTUyZmNlZjEw/MTRjMGI1ZTQ5Njcu/cG5n",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/nrn0MWgsaLm5mUI5pqVZCnW9i0thzxEhoS3fHJGXpbM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91eHdp/bmcuY29tL3dwLWNv/bnRlbnQvdGhlbWVz/L3V4d2luZy9kb3du/bG9hZC9icmFuZHMt/YW5kLXNvY2lhbC1t/ZWRpYS9yLXByb2dy/YW1taW5nLWxhbmd1/YWdlLWljb24ucG5n",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/KIKpJKv1q8zY1TT7yAK_ZqqhpVtZM1q9ccwTI6hFwUs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL1Mvc3FsLWxv/Z28tQzM3MERFQTA2/Ni1zZWVrbG9nby5j/b20ucG5n",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/iD90bkxTMWXr0VRxRbYauzDIaZiYq-39hVBuTxcZxXc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cGluY2xpcGFydC5j/b20vcGljZGlyL2Jp/Zy8zNjctMzY3ODg4/Ml9weXRob24tbG9n/by1jbGlwYXJ0LWVh/c3ktcGFuZGFzLXB5/dGhvbi1sb2dvLXBu/Zy5wbmc",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/CZA4uTBSqhe-UmllsbQMRvwijZaN_ZimAQAEc9byx84/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91c2Vy/LWltYWdlcy5naXRo/dWJ1c2VyY29udGVu/dC5jb20vNjc1ODY3/NzMvMTA1MDQwNzcx/LTQzODg3MzAwLTVh/ODgtMTFlYi05ZjAx/LWJlZTEwMGI5ZWYy/Mi5wbmc",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/t9-ZC2AHz_pLrVwMLLQkJCTZkCtPxZJ_hgMTlI82huQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9weXRo/b24tZ3JhcGgtZ2Fs/bGVyeS5jb20vc3Rh/dGljLzRlYzUyN2E5/NTBiNzRmYmFiMzk1/NjdiZWQ1NTAwNDky/L2I1NjU4L21hdHBs/b3RsaWIucG5n",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/zujl4El_iglahvU5xTaY-65Q6wW63VlFvM92u1m3wjo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91c2Vy/LWltYWdlcy5naXRo/dWJ1c2VyY29udGVu/dC5jb20vMzE1ODEw/LzkyMTYxNDE1LTll/MzU3MTAwLWVkZmUt/MTFlYS05MTdkLWY5/ZTMzZmQ2MDc0MS5w/bmc",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/bVrNj598g1sCHvdPnpQHsTf5k6RmptJpe0kp1dYmdRY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/ZnJlZWxvZ292ZWN0/b3JzLm5ldC93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxOC8wNy90/ZW5zb3JmbG93X2xv/Z28ucG5n",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/me_va_HyFjFejX27zUuZKEW2O5ubQwXtAo9Av-ur1hc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92aWN0/b3J6aG91LmNvbS9z/dGF0aWMvYzMwOWM0/YzZhN2JiZGI0M2Nm/MWYyOTA3ODZjZTQ3/YWIvMzk2MDAva2Vy/YXMtbG9nby5wbmc",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/ix9gSBj3NstAkf3hcnDzZjiWkX6Of0nWhFL40cynfOA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/c2Rvd25sb2FkLmNv/bS9sb2dvL3NjaWtp/dC1sZWFybi1sb2dv/LTUxMi5wbmc",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/osAdQLCFvce6mv9REfUow95FcaKi_-NzbdcK6bL8nUM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGF0YWJyaWNrcy5j/b20vZW4td2Vic2l0/ZS1hc3NldHMvc3Rh/dGljLzA0ZmU1NTU5/NmRmNGJjN2QzODk5/Y2IyN2NhZGU3NzQ4/L3NwYXJrX2xvZ29f/MngtMTY3OTAyMjA5/OC5wbmc",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/G6yq0JJDfGE84nztOFiMyM0TkIpU-M3bbHhFiamCDUA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbi1pY29ucy5j/b20vaWNvbnMyLzI2/OTkvUE5HLzUxMi9h/cGFjaGVfaGFkb29w/X2xvZ29faWNvbl8x/Njk1ODYucG5n",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/8f9W4S9RaS0RTat9aGUn_5k_idgGMYZfMz97KMPCCCY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy80/LzRiL1RhYmxlYXVf/TG9nby5wbmc",
        },
        {
          name: "logo",
          logo: "https://imgs.search.brave.com/sBfT6DgyToF2Mkpyvz57vf8Jx7zhEgLAgOnlZ9-3qno/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy1kb3dubG9hZC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjEvMDEvSnVweXRl/cl9Mb2dvLTU5N3g3/MDAucG5n",
        },
        {
            name: "logo",
            logo: "https://imgs.search.brave.com/ndDJLbmk7c_oqzHW2tViDqOYpj16glLf-SaFD1Ch9WM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kZXZl/bG9wZXJzLmdvb2ds/ZS5jb20vc3RhdGlj/L2FuYWx5dGljcy9p/bWFnZXMvdGVybXMv/bG9ja3VwX2ljX0dv/b2dsZV9BbmFseXRp/Y3NfdmVydF8zODhw/eEhfd2h0LnBuZw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/QF11dAUmbZ-TxlGXOR77EUkhT3Pfpt4G3rmi_-duUy4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy81/ODQyZjllZGE2NTE1/YjFlMGFkNzViMmUu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/kI-gZFZ0ehmqSYekaAGDlAnadT9154Z_SMltPSY6G-A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/bG9nb3BuZy5jb20v/aW1hZ2VzL2FsbF9p/bWcvMTY4MDM2OTIz/Mmdvb2dsZS1hZHMt/bG9nby1wbmcucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/zazaAMbJUvmU11DSJyGyfb9MrokQgrceDxiFi0r5zrg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4y/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvc29jaWFsLW1l/ZGlhLTIyODUvNTEy/LzFfRmFjZWJvb2tf/Y29sb3JlZF9zdmdf/Y29weS0xMjgucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/rzrft1ZDQvARcCsmHTVQGlNgsR1kSnpSWVE69Oeppf8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy13b3JsZC5uZXQv/d3AtY29udGVudC91/cGxvYWRzLzIwMjIv/MDEvSHViU3BvdC1M/b2dvLTcwMHgzOTQu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/YIYGplRiPmcJLAm7WTeL2BjEPN8UBm2hLel2EKOoP-E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIw/LzExL2NhbnZhLWxv/Z28tMDAwLnBuZw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/lGQQBkH1PiVVfOYFDOtKSwgTsew6d0nvgUEwJA71rW4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/NC9pbWFnZS0yLTEw/MjR4MzY2LnBuZw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/lUJPNXQmjdRxG9NwxTievpedBtabH8rT7TFY608-wAI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvcHJl/dmlld3MvMDIwLzk3/NS81Nzkvbm9uXzJ4/L3dvcmRwcmVzcy1s/b2dvLXdvcmRwcmVz/cy1pY29uLXRyYW5z/cGFyZW50LWZyZWUt/cG5nLnBuZw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/goXrppNhOrGAqtOS8wn2mwSELQaj9YJQHnV4x0xyNKc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9icmFu/ZGxvZ29zLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMi8w/Ny9ob290c3VpdGUt/bG9nb19icmFuZGxv/Z29zLm5ldF8zZ2J2/dC01MTJ4NTEyLnBu/Zw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/B0vCz8nC9uvx-uIqHkpTLZgez2scZrGyOwZanG1oFE0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lZXAu/aW8vaW1hZ2VzL3l6/Y280eHNpbXYweS8x/MFpSdTloWjFRUTV1/MVFRTXU3cU4xLzU3/ZjY3OWM2ZThmNmRk/NjBhMDFkNTRmODcw/ZmFlNmI3L01DXzUw/LTUwXy1fQnJhbmRf/QXNzZXRzXzAzLnBu/Zz93PTk4MCZxPTcw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/PTAamoAy9kpkfXtYVmZK1pQ9KKK1Jcue_uX-1qq6LDg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4w/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvbW9zdC11c2Fi/bGUtbG9nb3MvMTIw/L0J1ZmZlci01MTIu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/IxZyLungz3Ar1B2-sj_tDzcmAk5fNDuKwjaVnnSzmM4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy82/Mjk4Y2I3NjE3M2Y3/ODJjNjRhYmM3MDEu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/IcB-DW3zJXp-lIq2vhXHrcjj9HHVJCM3na9aunPJsxI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL1AvcG93ZXIt/YmktbWljcm9zb2Z0/LWxvZ28tRTRGQzhE/RTRBOS1zZWVrbG9n/by5jb20ucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/v3QL1vVH_6R1P2OgIoKQ2KddyDJfy0muoBRG_1vfGsI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy82/MTA0NWUxYTljZDY5/YzAwMDQxOGMxMWIu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/4HUDi-VTmEYFZUCDTa6Ci9OBIvVkcmm5xF8_99XXZuk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIw/LzA0L2V4Y2VsLWxv/Z28ucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/cH8xQCS8QUeSX6NZLguPnxxl39zvfXKEKooCenG7yi0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL0MvY21jLW1h/cmtldHMtbG9nby1D/RkEzMUYzMjkwLXNl/ZWtsb2dvLmNvbS5w/bmc",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/yI54Pf2K4VA1UZfknx0SDkpwbJStfPFZWZlR2Kh0bu8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuY2RubG9nby5j/b20vbG9nb3MvYS84/MS9hZG9iZS1hY3Jv/YmF0LXJlYWRlci5w/bmc",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/VK4aKKcpBocBqUsbPXjrqPe3sB1IEivebTkFoUxhUH4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL0EvYWdpbGUt/c3RhY2tzLWxvZ28t/RDUyRUFCRUMwRS1z/ZWVrbG9nby5jb20u/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/jJyzjNY8pq4yD44zBaoPt9Wg9QKW3Vsnys3Z1FFriIg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy82/MmM1YmVhODZhYWQ1/YWVkZjgwZTM3ZmYu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/gvosf90chXG0pi42KNg53pUJefgWJ41dCUPFmcmTz-o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIx/LzA4L21pY3Jvc29m/dC10ZWFtcy1sb2dv/LTEucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/hv0I2K5sqJRFwyiTUV_RdLB7D8gpn5KstdnCeexqMCg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kY2Eu/d2hhcnRvbi51cGVu/bi5lZHUvd3AtY29u/dGVudC91cGxvYWRz/LzIwMTgvMDUvQWxw/aGFfU2Vuc2VfTG9n/by05Mjl4MTg1LnBu/Zw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/vUnQyYaz_WkoNpeNH8wXhBUzY-wIC6yW7Tc_nW3H5uI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pY29u/YXBlLmNvbS93cC1j/b250ZW50L3BuZ19s/b2dvX3ZlY3Rvci9h/bXAtY2FwaXRhbC1p/bnZlc3RvcnMtbG9n/by5wbmc",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/RIWubBcM-d29YmvUHHfdDF7Je7MyqCovJqNNIql8QXY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb21w/YW5pZXNsb2dvLmNv/bS9pbWcvb3JpZy9T/UEdJLTIzZDgzNmZh/LnBuZz90PTE3MjAy/NDQ0OTQ",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/MPR7kJUeuXx9Pklzuc3tOmCLSCfabHH41Ji7kWBTTUs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9icmFu/ZHNsb2dvcy5jb20v/d3AtY29udGVudC91/cGxvYWRzL2ltYWdl/cy9tb25nb2RiLWxv/Z28ucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/sYjpur0hn0ZBPi7v8V0BGsiXjCfS9lvEZzSgwMmeEcg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL04vbm9kZS1u/b2RlLWpzLWxvZ28t/ODFBNENDMTZEMi1z/ZWVrbG9nby5jb20u/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/-wRYfmc8MFTE9dYoFBioZSxfu45QaJyuKfJ3h68gZGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG40/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvbG9nb3MtMy82/MDAvUmVhY3QuanNf/bG9nby01MTIucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/LIea-pN6nqcCnpP06BMKscWNtNLYzqZ5pIxmeEBjWKo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hYm91/dC5naXRsYWIuY29t/L2ltYWdlcy9wcmVz/cy9sb2dvL3BuZy9v/bGQtbG9nby1uby1i/a2dyZC5wbmc",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/50BWQRinqcmd5OzZEEtbbthYiiGVgZxyJKHNH1jojE8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb21w/YW5pZXNsb2dvLmNv/bS9pbWcvb3JpZy9B/UEcuRC1hMTNmMDI2/Ni5wbmc_dD0xNzIw/MjQ0NDkw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/xql0l4I3EKn-Qixq0JMP8IJvZzj_uV0W9Hlvni1OIO0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy82/MmE3NTY0MDIyMzM0/M2ZiYzIyMDdkMTAu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/sLjkntqcoU5__Gfnzy7SmLIaX0ca_YXxacZjIx9Td04/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTMvQVdT/LUxvZ28tUE5HLUlt/YWdlcy5wbmc",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/dtyGnPvP6sAZ3JhWOPV6axmuWxA-SVUSKnzt4Z3tfTs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/c3BuZy5vcmcvZG93/bmxvYWQvaGVyb2t1/L2hlcm9rdS0yMDQ4/LnBuZw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/PcVKeyY4rW_1yaklQePuNTal6QKhmzgAg0BX1-Asd_o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZXBzLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxMy8wMy9q/d3QtdmVjdG9yLWxv/Z28ucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/fCXfhT5tV1dng4EwZiI55x9QN809FrZiJv3xl4PeUpo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy82/MmE3NjQ2OGJkNzNh/NGFmNWM1ZDRmYjcu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/FfIehN7XKxDIYyYoUlbJyNRktsMDWbuhlvQeMGy65aI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL04vbm9kZWpz/LWxvZ28tRkJFMTIy/RTM3Ny1zZWVrbG9n/by5jb20ucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/x6nFfZITE3DVtWQcTYLr6O4TzK8Cur7P2nW99s8KAdo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pY29u/YXBlLmNvbS93cC1j/b250ZW50L3BuZ19s/b2dvX3ZlY3Rvci92/dWUtanMtbG9nby5w/bmc",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/6eIa5y6QhedF3babUzyvLeMyf4FXNBp2KFhJcgES0Ig/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL1QvdGFpbHdp/bmQtY3NzLWxvZ28t/ODlFOTlENzE4MS1z/ZWVrbG9nby5jb20u/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/EVI0jkHFDwQcYNZssceYZcRxbXv1gMmxJwYHoYQBSe0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9icmFu/ZHNsb2dvcy5jb20v/d3AtY29udGVudC91/cGxvYWRzL2ltYWdl/cy9odG1sLWxvZ28u/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/4AM7FZL7vN_KNfEKfzE-s8HgkZcE2ZzUgMMZK0IWSKM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dC5icmFuZGZldGNo/LmlvL2lkZlZMOUZN/ZmgvaWQyZ2RPSUox/TS5wbmc_dXBkYXRl/ZD0xNzExNzE4NDgz/OTU2",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/-Uk30l7g2gg75trO5z6AT3tmJGqlH_Tt8vE2WC0sbqE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIxLzA1/L0F0bGFzc2lhbi1M/b2dvLTIwMTBzMS01/MDB4MzM5LnBuZw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/EK-Kn6J5Q5tx8BfYmeTzgGc1vfWY9nVB_dc1eqeXtZU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL1Mvc2NydW0t/b3JnLWxvZ28tRTQz/NEVCQzYwRi1zZWVr/bG9nby5jb20ucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/tFM-YCRhPjrFuNQcbttCVypFAPmCwzU66NEc3ATMjCo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy13b3JsZC5uZXQv/d3AtY29udGVudC91/cGxvYWRzLzIwMjEv/MDMvVHJlbGxvLUxv/Z28tMjAyMS1wcmVz/ZW50LTcwMHgzOTQu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/8RA3ov7FhRR6Eshrfsy2r4-IJXAr4Pxlewo5UCkWegQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL3RodW1icy82/MmM2YmMyNWVlZTk0/MTBmZTEzN2Q5MWYu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/0m70Mi72riak2llirHov-uV5L9iPw9h6KsslWWZPFHY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy1kb3dubG9hZC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMDYvU3VydmV5/TW9ua2V5X0xvZ29f/b2xkLTcwMHgyMjcu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/-MP9-7TucHwpfSa5thR1eJQ8Hg--sJa5doxBez5vXjY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92ZWN0/b3JzZWVrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMy8w/OC9Hb29nbGUtVHJl/bmRzLUxvZ28tVmVj/dG9yLnN2Zy0ucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/CuMgjeX70v4kMR-vIsw21slkqXwsI7_0jOC2zaFkPuE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kZXZl/bG9wZXJzLmdvb2ds/ZS5jb20vc3RhdGlj/L2FuYWx5dGljcy9p/bWFnZXMvdGVybXMv/bG9ja3VwX2ljX0Fu/YWx5dGljc19ob3Jp/el8yNzJweF93aHQu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/V0moBeN1EY9RGhAk3cIKulsjyrIVMoJl7vatICB0K7o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy13b3JsZC5uZXQv/d3AtY29udGVudC91/cGxvYWRzLzIwMjEv/MTAvVGFibGVhdS1M/b2dvLTcwMHgzOTQu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/rzrft1ZDQvARcCsmHTVQGlNgsR1kSnpSWVE69Oeppf8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy13b3JsZC5uZXQv/d3AtY29udGVudC91/cGxvYWRzLzIwMjIv/MDEvSHViU3BvdC1M/b2dvLTcwMHgzOTQu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/luZqG5AXVj6l79kk6l2p_S1iVqEzZM1asGngliGVFms/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIw/LzA0L3NhbGVzZm9y/Y2UtbG9nby0wLnBu/Zw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/34boMDewlt5B3f_MUn18TUwD_xxN2yW__Bj48Fwwfbs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy81/ODQyZjllMGE2NTE1/YjFlMGFkNzViMmQu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/ZE_7EJlLX2Ai6xeG2oW2odxwSJ4QmwL0AB-qagV5Xqw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL0kvaW52aXNp/b24tbG9nby1CMjYy/QkU5NkFBLXNlZWts/b2dvLmNvbS5wbmc",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/HoFgowIt93L6DejL_42qWYF5ldrdJxxJXGPY7oyu9S0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/bG9nb3BuZy5jb20v/aW1hZ2VzL2FsbF9p/bWcvMTY1NjczMjky/N2NhbnZhLWxvZ28t/cG5nLnBuZw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/ndDJLbmk7c_oqzHW2tViDqOYpj16glLf-SaFD1Ch9WM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kZXZl/bG9wZXJzLmdvb2ds/ZS5jb20vc3RhdGlj/L2FuYWx5dGljcy9p/bWFnZXMvdGVybXMv/bG9ja3VwX2ljX0dv/b2dsZV9BbmFseXRp/Y3NfdmVydF8zODhw/eEhfd2h0LnBuZw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/QF11dAUmbZ-TxlGXOR77EUkhT3Pfpt4G3rmi_-duUy4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy81/ODQyZjllZGE2NTE1/YjFlMGFkNzViMmUu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/kI-gZFZ0ehmqSYekaAGDlAnadT9154Z_SMltPSY6G-A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/bG9nb3BuZy5jb20v/aW1hZ2VzL2FsbF9p/bWcvMTY4MDM2OTIz/Mmdvb2dsZS1hZHMt/bG9nby1wbmcucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/zazaAMbJUvmU11DSJyGyfb9MrokQgrceDxiFi0r5zrg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4y/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvc29jaWFsLW1l/ZGlhLTIyODUvNTEy/LzFfRmFjZWJvb2tf/Y29sb3JlZF9zdmdf/Y29weS0xMjgucG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/rzrft1ZDQvARcCsmHTVQGlNgsR1kSnpSWVE69Oeppf8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/cy13b3JsZC5uZXQv/d3AtY29udGVudC91/cGxvYWRzLzIwMjIv/MDEvSHViU3BvdC1M/b2dvLTcwMHgzOTQu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/MKFgBMdAyPUXvdgvXoOO_81RjQsP2IwrTJi-d8PV3oM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9vcHRp/bWl6YXRpb251cC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjEvMDIvQ29weS1v/Zi1VbnRpdGxlZC00/LnBuZw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/jI45Y9KkSSsGwAm5LiXs1aDACCwn9wtzJmQn5LiaYFk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/bG9nb3BuZy5jb20v/aW1hZ2VzL2FsbF9p/bWcvMTY1Njk1ODcz/M2xpbmtlZGluLWxv/Z28tcG5nLnBuZw",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/LURXNHkYiebDfc6ncH0bM43iq6Dq2nhbvcKKWEWx51Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/bG9nb3BuZy5jb20v/aW1hZ2VzL2FsbF9p/bWcvMTY1ODU4NzE2/Mmluc3RhZ3JhbS1s/b2dvLXBuZy1oZC5w/bmc",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/1do04ngOhGGetjHSVFwDDzrVbxExTFFP17TlKRlK7hY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIxLzEy/L0hvb3RzdWl0ZS1M/b2dvLTIwMDgtNTAw/eDI4MS5wbmc",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/uU0bbL7a8VHe8UstHE4lGkJC5FomSK8_T4mwWSKLtZ4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy82/MWZhZTJkMzk1ZTZj/YTAwMDQ3YjRmMTIu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/34boMDewlt5B3f_MUn18TUwD_xxN2yW__Bj48Fwwfbs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy81/ODQyZjllMGE2NTE1/YjFlMGFkNzViMmQu/cG5n",
          },
          {
            name: "logo",
            logo: "https://imgs.search.brave.com/NIrpMJL2SGOjaThAx1gpXXAT4CudXVfzZOVOogdHWeg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/b3B0bXl6ci5jb20v/Zm9yZXN0cnkvbWFi/by0wMS5wbmc",
          },
      ];



  return (
    <div>
        <div className="container  mx-auto">
            <h1
              data-aos="fade-up"
              className="  font-bold text-[#f15b29] text-center mb-6"
            >
              | Learn the Must-Have Skills and Tools
            </h1>
            <div className="logos">
<div className='logodiv'>
{skills.map((skills, index) => (
  
              
              <img
                src={skills.logo}
                alt={`${skills.name}`}
                className="filter grayscale hover:grayscale-0 transition-all duration-300"
              />
          ))}
</div>
            </div>
          </div>
    </div>
  )
}

export default Skills
