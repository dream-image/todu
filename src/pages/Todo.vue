<template>
    <div style="display: flex;justify-content: space-between; position: relative;left: 0;right: 0;margin: auto;"
        @mousemove="update(obj, 1)" @mouseleave="update(obj, 0)">
        <ul id="insideUl">
            <div style="display: flex;justify-content: space-around; width: 300px;">
                <div style="display: flex;justify-content: space-between; width: 230px;">
                    <div style="display: flex;justify-content: space-between;width: 150px;">
                        <li style="height: 30px;overflow: hidden;width: 80px;">{{ obj.EventName }}</li>
                        <li v-if="!isUpdate" style="position: relative;left: 35px;">{{ obj.DeadLine }}</li>
                        <input v-if="isUpdate" v-model="obj.DeadLine" @blur="toUpdate" @keydown.enter="$event.target.blur()"
                            id="updateInput" ref="focus">
                        <!-- 这里解决了keydown和blur触发两次问题 -->
                    </div>
                    <li id="state">
                        <i v-if="obj.State" class="el-icon-success" style="color:#64c43c;" @click="changeLable"></i>
                        <i v-if="!obj.State" class="el-icon-error" style="color: red;" @click="changeLable"></i>
                    </li>
                </div>
                <div id="replace" v-if="!obj.display" style="position: relative;left: 30px;"></div>
                <div id="update" v-if="obj.display" @click="updateDeadLine" style="position: relative;left: 30px;"><i
                        class="el-icon-edit"></i></div>
            </div>
        </ul>
        <transition appear name="animate__animated animate__bounce animate__faster" enter-active-class="animate__rotateIn"
            leave-active-class="animate__rotateOut">
            <el-button type="danger" icon="el-icon-delete" circle id="delete" v-if="isShowDelete"
                @click="deleteThing"></el-button>
        </transition>
        <div  v-if="this.createdBy =='others'" class="createdBy" ref="createdBy">
            <i class="el-icon-user"></i>{{obj.createdBy }}
        </div>
        <div class="createdBy" v-if="this.createdBy !='others'">
            <!-- 这个容器是为了提到因上一个容器消失而缺失的位置，不然会出现布局问题 -->
        </div>
    </div>
</template>
<script scoped>
export default {
    name: 'todu',
    props: ['obj','createdBy'],
    data() {
        return {
            isUpdate: false,
            isShowDelete: false,
            Deadline: this.obj.DeadLine
        }
    },
    methods: {
        update(obj, val) {
            if (val) {
                this.isShowDelete = true
                obj.display = true
            }
            else {
                obj.display = false
                this.isShowDelete = false
            }

        },
        updateDeadLine() {
            this.isUpdate = !this.isUpdate
            this.$nextTick(function () {
                this.$refs.focus.focus()
            })
        },
        toUpdate() {
            if (this.isUpdate) {
                this.isUpdate = !this.isUpdate
            }
            let bijiao= JSON.parse(window.sessionStorage.getItem('todoList'))
            bijiao.forEach(data=>{
                if(data.EventName==this.obj.EventName && data.DeadLine !=this.obj.DeadLine){
                    setTimeout(() => {
                    this.$store.dispatch('Update', { DeadLine: this.obj.DeadLine, vm: this, UserID: this.obj.UserID, EventName: this.obj.EventName, State: this.obj.State, UpdateWho: 'DeadLine' })
                }, 100);
                }
            })
        },
        changeLable() {
            this.$confirm('是否修改？', '提示', {
                iconClass: 'el-icon-question',
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                showClose: true,
                type: 'warning'
            }).then(() => {
                // 确认后操作
                setTimeout(() => {
                    this.$store.dispatch('Update', { EventName: this.obj.EventName, State: !this.obj.State, UserID: this.obj.UserID, DeadLine: this.obj.DeadLine, vm: this, UpdateWho: 'State' })
                }, 100);


            }).then(() => {
                // 取消后操作

            }).catch(function (err) {
                console.log(err)
            })

        },
        deleteThing() {
            this.$confirm("是否删除？", "提示", {
                iconClass: 'el-icon-question',
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                showClose: true,
                type: 'warning'
            }).then(() => {
                // 确认后操作
                this.$store.dispatch('delete', { EventName: this.obj.EventName, UserID: this.obj.UserID, vm: this })
            }).then(() => {
                // 取消后操作

            }).catch(function (err) {
                console.log(err)
            })
        },

    },
    mounted() {
    
        
    },
    watch: {
    }


}
</script>
<style scoped>
#insideUl {
    position: relative;
    left: 0;
    right: 0;
    width: 350px;
    height: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    line-height: 30px;
    text-align: center;
    border: 1px rgba(255, 99, 71, 0.5) solid;
    flex-grow: 0;
    flex-shrink: 0;
}

#state {
    width: 30px;
    height: 30px;
    position: relative;
    left: 30px;
}

#state:hover {
    background-color: gold;
}

#update {
    background-color: #bfa;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 15px;
}

#replace {
    width: 30px;
    height: 30px;
}

#update:hover {
    background-color: gold;
}

#updateInput {
    width: 100px;
    height: 30px;
}

#delete {
    width: 30px;
    height: 30px;
    padding: 0;
    position: relative;

}
.createdBy{
    position: relative;
    align-items: center;
    text-align: center;
    height: 30px;
    line-height: 30px;
    width: 100px;
}
</style>