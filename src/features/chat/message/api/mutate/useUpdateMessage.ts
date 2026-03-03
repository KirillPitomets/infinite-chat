import { edenClient } from "@/shared/lib/eden"
import {
  ChatUIMessage,
  mapAPIMessageToUI,
  UIAttachment
} from "@/features/chat/message/model/message.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { chatKeys } from "../../../chat/model/chat.keys"
import { useChangeMessageStatus } from "../useChangeMessageStatus"
import { useUploadThing } from "@/shared/utils/uploadthing"
import { MessageAttachment } from "@/shared/schemes/message.schema"
import { formatUploadedFiles } from "../../utils/formatUploadedFiles"

type useUpdateMessageArgs = {
  chatId: string
  cancelUpdate: () => void
}

export function useUpdateMessage({
  chatId,
  cancelUpdate
}: useUpdateMessageArgs) {
  const queryClient = useQueryClient()
  const changeMessageStatus = useChangeMessageStatus()
  const { startUpload } = useUploadThing("chatUploadImage")

  return useMutation<
    ChatUIMessage,
    Error,
    {
      messageId: string
      content?: string
      files?: File[]
    },
    { previousMessages: ChatUIMessage[] }
  >({
    mutationFn: async ({ messageId, content, files }) => {
      const filesUploaded = files?.length ? await startUpload(files) : []

      const formattedAttachments: MessageAttachment[] = filesUploaded
        ? formatUploadedFiles(filesUploaded)
        : []

      const res = await edenClient
        .message({ messageId })
        .put({ content, files: formattedAttachments })

      if (res.status !== 200 || !res.data) {
        throw new Error(res.error?.value.message ?? "Failed to update message")
      }

      return mapAPIMessageToUI(res.data, "sent", false)
    },
    onMutate: async ({ messageId }) => {
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      })

      const previousMessages =
        queryClient.getQueryData<ChatUIMessage[]>([
          "getChatMessages",
          chatId
        ]) ?? []

      changeMessageStatus({ chatId, messageId, status: "loading" })

      return { previousMessages }
    },
    onSuccess: data => {
      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old => old?.map(msg => (msg.id === data.id ? data : msg)) ?? []
      )
      toast.success("Message have been updated")
      cancelUpdate()
    },
    onError: (error, _, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(chatId),
          context.previousMessages
        )
      }

      toast.error(error.message)
      cancelUpdate()
    }
  })
}
